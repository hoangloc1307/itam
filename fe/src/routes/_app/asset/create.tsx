'use no memo';

import { IconArrowLeft } from '@tabler/icons-react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { createAssetSchema, type CreateAssetInput } from 'itam-shared/schemas/asset';
import { ASSET_STATUSES } from 'itam-shared/constants';
import type { AssetAttributeValueItem } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryQueries } from '~/api/category.queries';
import { modelAttributeValueQueries } from '~/api/model-attribute-value.queries';
import { modelQueries } from '~/api/model.queries';
import { categoryAttributeQueries } from '~/api/category-attribute.queries';
import { Button } from '~/components/ui/button';
import { FieldGroup } from '~/components/ui/field';
import { Separator } from '~/components/ui/separator';
import { useCreateAsset } from '~/hooks/mutations/use-asset';
import { useAppForm } from '~/hooks/use-app-form';
import { AssetAttributeForm } from '~/routes/_app/asset/asset-attribute-form';

const ASSET_STATUS_OPTIONS = Object.values(ASSET_STATUSES).map((value) => ({
  label: value,
  value,
}));

const CreateAssetPage = () => {
  const { t } = useTranslation('asset');
  const navigate = useNavigate();
  const createMutation = useCreateAsset();
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

  // Build the attribute list (from model attribute values if model selected, else from category attributes)
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

  // Pre-fill attribute values from model when data arrives
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

  // When category changes and no model, reset attribute values
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

  type FormValues = Omit<CreateAssetInput, 'attributeValues'>;

  const form = useAppForm({
    defaultValues: {
      id: '',
      assetCode: null,
      name: '',
      categoryId: '',
      modelId: null,
      vendorId: null,
      purchaseDate: null,
      purchasePrice: null,
      warrantyStartDate: null,
      warrantyEndDate: null,
      warrantyMonth: null,
      serialNumber: null,
      location: null,
      maintenanceIntervalHours: null,
      quantity: 1,
      remainQuantity: 1,
      qrCode: null,
      assetStatus: ASSET_STATUSES.AVAILABLE,
      assignedTo: null,
      currentSection: null,
    } as FormValues,
    validators: {
      onSubmit: createAssetSchema.omit({ attributeValues: true }),
    },
    onSubmit: async ({ value }) => {
      const payload: CreateAssetInput = {
        ...value,
        attributeValues,
      };
      await createMutation.mutateAsync(payload);
      navigate({ to: '/asset' });
    },
  });

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
            <h1 className='text-foreground text-2xl font-bold'>{t('addNew')}</h1>
          </div>
          <div className='flex items-center gap-3'>
            <form.AppForm>
              <form.SubmitButton>{t('addNew')}</form.SubmitButton>
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
                <div className='col-span-6 md:col-span-3'>
                  <form.AppField
                    name='id'
                    children={(field) => <field.TextField label={t('form.id')} />}
                  />
                </div>
                <div className='col-span-6 md:col-span-3'>
                  <form.AppField
                    name='assetCode'
                    children={(field) => <field.TextField label={t('form.assetCode')} />}
                  />
                </div>
                <div className='col-span-12 md:col-span-6'>
                  <form.AppField
                    name='name'
                    children={(field) => <field.TextField label={t('form.name')} />}
                  />
                </div>
                <div className='col-span-6 md:col-span-5 xl:col-span-4'>
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
                <div className='col-span-6 md:col-span-7 xl:col-span-4'>
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
                <div className='col-span-6 md:col-span-4'>
                  <form.AppField
                    name='serialNumber'
                    children={(field) => <field.TextField label={t('form.serialNumber')} />}
                  />
                </div>
                <div className='col-span-6 md:col-span-4'>
                  <form.AppField
                    name='location'
                    children={(field) => <field.TextField label={t('form.location')} />}
                  />
                </div>
                <div className='col-span-6 md:col-span-4'>
                  <form.AppField
                    name='assignedTo'
                    children={(field) => <field.TextField label={t('form.assignedTo')} />}
                  />
                </div>
                <div className='col-span-6 md:col-span-4'>
                  <form.AppField
                    name='currentSection'
                    children={(field) => <field.TextField label={t('form.currentSection')} />}
                  />
                </div>
                <div className='col-span-3 xl:col-span-2'>
                  <form.AppField
                    name='quantity'
                    children={(field) => (
                      <field.NumberField
                        label={t('form.quantity')}
                        allowNegative={false}
                        decimalScale={0}
                      />
                    )}
                  />
                </div>
                <div className='col-span-3 xl:col-span-2'>
                  <form.AppField
                    name='remainQuantity'
                    children={(field) => (
                      <field.NumberField
                        label={t('form.remainQuantity')}
                        allowNegative={false}
                        decimalScale={0}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6 xl:col-span-2'>
                  <form.AppField
                    name='assetStatus'
                    children={(field) => (
                      <field.SelectField label={t('form.assetStatus')} options={statusOptions} />
                    )}
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
                    children={(field) => <field.DatePickerField label={t('form.purchaseDate')} />}
                  />
                </div>
                <div className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2'>
                  <form.AppField
                    name='warrantyStartDate'
                    children={(field) => (
                      <field.DatePickerField label={t('form.warrantyStartDate')} />
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
                    name='warrantyMonth'
                    children={(field) => (
                      <field.NumberField
                        label={t('form.warrantyMonth')}
                        allowNegative={false}
                        decimalScale={0}
                      />
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

          {/* Attribute Values / Configuration */}
          {selectedCategoryId && attributes.length > 0 && (
            <>
              <Separator />
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
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export const Route = createFileRoute('/_app/asset/create')({ component: CreateAssetPage });
