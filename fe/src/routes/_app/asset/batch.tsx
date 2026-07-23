'use no memo';

import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { AssetAttributeValueItem, AssetStatus } from 'itam-shared/types';
import { ASSET_STATUSES } from 'itam-shared/constants';
import type { BatchAssetItem, CreateBatchAssetInput } from 'itam-shared/schemas/asset';
import { addMonths, format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryQueries } from '~/api/category.queries';
import { categoryAttributeQueries } from '~/api/category-attribute.queries';
import { modelAttributeValueQueries } from '~/api/model-attribute-value.queries';
import { modelQueries } from '~/api/model.queries';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { FieldGroup } from '~/components/ui/field';
import { Separator } from '~/components/ui/separator';
import { useCreateBatchAsset } from '~/hooks/mutations/use-asset';
import { useAppForm } from '~/hooks/use-app-form';
import { AssetAttributeForm } from '~/routes/_app/asset/asset-attribute.form';

const ASSET_STATUS_OPTIONS = Object.values(ASSET_STATUSES).map((value) => ({
  label: value,
  value: value as AssetStatus,
}));

const BatchAssetPage = () => {
  const { t } = useTranslation('asset');
  const navigate = useNavigate();
  const createBatchMutation = useCreateBatchAsset();
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<BatchAssetItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [attributeValues, setAttributeValues] = useState<
    { attributeId: number; value: string | null }[]
  >([]);

  const { data: categoriesData } = useSuspenseQuery(categoryQueries.all());

  const { data: modelsData } = useQuery({
    ...modelQueries.all(selectedCategoryId || undefined),
    enabled: !!selectedCategoryId,
  });

  const { data: categoryAttributesData } = useQuery({
    ...categoryAttributeQueries.byCategory(selectedCategoryId),
    enabled: !!selectedCategoryId,
  });

  const { data: modelAttributeValuesData } = useQuery({
    ...modelAttributeValueQueries.byModelId(selectedModelId ?? ''),
    enabled: !!selectedModelId,
  });

  const categoryOptions = (categoriesData?.data ?? []).map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const modelOptions = (modelsData?.data ?? []).map((model) => ({
    label: model.name,
    value: model.id,
  }));

  const statusOptions = ASSET_STATUS_OPTIONS.map((opt) => ({
    label: t(`assetStatus.${opt.value}`),
    value: opt.value,
  }));

  // Build the attribute list
  const attributes: AssetAttributeValueItem[] =
    modelAttributeValuesData?.data ??
    categoryAttributesData?.data?.map((ca) => ({
      attributeId: ca.attributeId,
      name: ca.name,
      measurementUnit: ca.measurementUnit,
      dataType: ca.dataType,
      options: ca.options,
      groupId: null,
      groupName: ca.groupName,
      isRequired: ca.isRequired,
      value: null,
    })) ??
    [];

  // Pre-fill attribute values from model
  const [lastPrefilledModelId, setLastPrefilledModelId] = useState<string | null>(null);
  const [lastCategoryId, setLastCategoryId] = useState<string | null>(null);

  if (
    selectedModelId &&
    selectedModelId !== lastPrefilledModelId &&
    modelAttributeValuesData?.data
  ) {
    setLastPrefilledModelId(selectedModelId);
    setAttributeValues(
      modelAttributeValuesData.data.map((attr) => ({
        attributeId: attr.attributeId,
        value: attr.value,
      })),
    );
  }

  if (
    !selectedModelId &&
    selectedCategoryId &&
    selectedCategoryId !== lastCategoryId &&
    categoryAttributesData?.data
  ) {
    setLastCategoryId(selectedCategoryId);
    setAttributeValues(
      categoryAttributesData.data.map((ca) => ({
        attributeId: ca.attributeId,
        value: null,
      })),
    );
  }

  const form = useAppForm({
    defaultValues: {
      name: '',
      categoryId: '',
      modelId: null as string | null,
      vendorId: null as string | null,
      purchaseDate: null as string | null,
      purchasePrice: null as number | null,
      warrantyStartDate: null as string | null,
      warrantyEndDate: null as string | null,
      warrantyMonth: null as number | null,
      location: null as string | null,
      maintenanceIntervalHours: null as number | null,
      assetStatus: ASSET_STATUSES.AVAILABLE as AssetStatus,
      assignedTo: null as string | null,
      currentSection: null as string | null,
    },
    onSubmit: async ({ value }) => {
      if (items.length === 0) return;
      const payload: CreateBatchAssetInput = {
        ...value,
        attributeValues,
        items,
      };
      await createBatchMutation.mutateAsync(payload);
      navigate({ to: '/asset' });
    },
  });

  const generateItems = () => {
    const generated: BatchAssetItem[] = [];
    for (let i = 0; i < quantity; i++) {
      generated.push({
        id: '',
        assetCode: null,
        serialNumber: null,
      });
    }
    setItems(generated);
  };

  const updateItem = (index: number, field: keyof BatchAssetItem, value: string | null) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => navigate({ to: '/asset' })}
            >
              <IconArrowLeft className='size-5' />
            </Button>
            <h1 className='text-foreground text-2xl font-bold'>{t('batch.title')}</h1>
          </div>
          <div className='flex items-center gap-3'>
            <form.AppForm>
              <form.SubmitButton>
                <IconDeviceFloppy data-icon='inline-start' />
                {t('batch.submit', { count: items.length })}
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </div>

        <div className='space-y-8'>
          {/* Basic Information */}
          <section>
            <h2 className='text-foreground mb-4 text-lg font-semibold'>
              {t('sections.basicInfo')}
            </h2>
            <FieldGroup>
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-12 md:col-span-6'>
                  <form.AppField
                    name='name'
                    children={(field) => <field.TextField label={t('form.name')} />}
                  />
                </div>
                <div className='col-span-6 md:col-span-3'>
                  <form.AppField
                    name='categoryId'
                    children={(field) => (
                      <field.ComboboxField
                        label={t('form.categoryId')}
                        options={categoryOptions}
                        onChange={(value) => {
                          setSelectedCategoryId(value);
                          setSelectedModelId(null);
                          form.setFieldValue('modelId', null);
                          setAttributeValues([]);
                        }}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6 md:col-span-3'>
                  <form.AppField
                    name='modelId'
                    children={(field) => (
                      <field.ComboboxField
                        label={t('form.modelId')}
                        options={modelOptions}
                        onChange={(value) => {
                          setSelectedModelId(value || null);
                        }}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6 md:col-span-3'>
                  <form.AppField
                    name='location'
                    children={(field) => <field.TextField label={t('form.location')} />}
                  />
                </div>
                <div className='col-span-6 md:col-span-3'>
                  <form.AppField
                    name='assetStatus'
                    children={(field) => (
                      <field.SelectField label={t('form.assetStatus')} options={statusOptions} />
                    )}
                  />
                </div>
                <div className='col-span-6 md:col-span-3'>
                  <form.AppField
                    name='assignedTo'
                    children={(field) => <field.TextField label={t('form.assignedTo')} />}
                  />
                </div>
                <div className='col-span-6 md:col-span-3'>
                  <form.AppField
                    name='currentSection'
                    children={(field) => <field.TextField label={t('form.currentSection')} />}
                  />
                </div>
              </div>
            </FieldGroup>
          </section>

          <Separator />

          {/* Purchase & Warranty */}
          <section>
            <h2 className='text-foreground mb-4 text-lg font-semibold'>
              {t('sections.purchaseWarranty')}
            </h2>
            <FieldGroup>
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2'>
                  <form.AppField
                    name='purchasePrice'
                    children={(field) => (
                      <field.NumberField
                        label={t('form.purchasePrice')}
                        allowNegative={false}
                        decimalScale={2}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2'>
                  <form.AppField
                    name='purchaseDate'
                    children={(field) => (
                      <field.DatePickerField
                        label={t('form.purchaseDate')}
                        onChange={(value) => {
                          if (value && !form.getFieldValue('warrantyStartDate')) {
                            form.setFieldValue('warrantyStartDate', value);
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2'>
                  <form.AppField
                    name='warrantyMonth'
                    children={(field) => (
                      <field.NumberField
                        label={t('form.warrantyMonth')}
                        allowNegative={false}
                        decimalScale={0}
                        onChange={(value) => {
                          const startDate = form.getFieldValue('warrantyStartDate') as
                            | string
                            | null;
                          if (startDate && value) {
                            const endDate = addMonths(new Date(startDate), value);
                            form.setFieldValue('warrantyEndDate', format(endDate, 'yyyy-MM-dd'));
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2'>
                  <form.AppField
                    name='warrantyStartDate'
                    children={(field) => (
                      <field.DatePickerField
                        label={t('form.warrantyStartDate')}
                        onChange={(value) => {
                          const months = form.getFieldValue('warrantyMonth') as number | null;
                          if (value && months) {
                            const endDate = addMonths(new Date(value), months);
                            form.setFieldValue('warrantyEndDate', format(endDate, 'yyyy-MM-dd'));
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2'>
                  <form.AppField
                    name='warrantyEndDate'
                    children={(field) => (
                      <field.DatePickerField label={t('form.warrantyEndDate')} />
                    )}
                  />
                </div>
                <div className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2'>
                  <form.AppField
                    name='maintenanceIntervalHours'
                    children={(field) => (
                      <field.NumberField
                        label={t('form.maintenanceIntervalHours')}
                        allowNegative={false}
                        decimalScale={0}
                      />
                    )}
                  />
                </div>
              </div>
            </FieldGroup>
          </section>

          <Separator />

          {/* Attribute Values / Configuration */}
          {selectedCategoryId && attributes.length > 0 && (
            <>
              <section>
                <h2 className='text-foreground mb-1 text-lg font-semibold'>
                  {t('sections.attributes')}
                </h2>
                {selectedModelId && (
                  <p className='text-muted-foreground mb-4 text-sm'>
                    {t('attributeForm.prefilledFromModel')}
                  </p>
                )}
                {!selectedModelId && <div className='mb-4' />}
                <AssetAttributeForm
                  attributes={attributes}
                  values={attributeValues}
                  onChange={setAttributeValues}
                />
              </section>

              <Separator />
            </>
          )}

          {/* Generate Items */}
          <section>
            <h2 className='text-foreground mb-4 text-lg font-semibold'>
              {t('batch.generateTitle')}
            </h2>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-4 md:col-span-3'>
                <Label>{t('batch.quantity')}</Label>
                <Input
                  type='number'
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className='col-span-12 flex items-end md:col-span-3'>
                <Button type='button' className='w-full' onClick={generateItems}>
                  {t('batch.generate')}
                </Button>
              </div>
            </div>
            <p className='text-muted-foreground mt-2 text-xs'>{t('batch.autoGenerate')}</p>
          </section>

          {/* Items Table */}
          {items.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className='text-foreground mb-4 text-lg font-semibold'>
                  {t('batch.itemsTitle', { count: items.length })}
                </h2>
                <div className='max-h-96 overflow-y-auto rounded border'>
                  <table className='w-full text-sm'>
                    <thead className='bg-muted sticky top-0'>
                      <tr>
                        <th className='px-3 py-2 text-left'>#</th>
                        <th className='px-3 py-2 text-left'>{t('form.id')}</th>
                        <th className='px-3 py-2 text-left'>{t('form.assetCode')}</th>
                        <th className='px-3 py-2 text-left'>{t('form.serialNumber')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className='border-t'>
                          <td className='text-muted-foreground px-3 py-1.5'>{index + 1}</td>
                          <td className='text-muted-foreground px-3 py-1.5 italic'>
                            {t('form.idAutoGenerate')}
                          </td>
                          <td className='px-3 py-1.5'>
                            <Input
                              value={item.assetCode ?? ''}
                              onChange={(e) =>
                                updateItem(index, 'assetCode', e.target.value || null)
                              }
                              className='h-8'
                            />
                          </td>
                          <td className='px-3 py-1.5'>
                            <Input
                              value={item.serialNumber ?? ''}
                              onChange={(e) =>
                                updateItem(index, 'serialNumber', e.target.value || null)
                              }
                              className='h-8'
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export const Route = createFileRoute('/_app/asset/batch')({ component: BatchAssetPage });
