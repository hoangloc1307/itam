'use no memo';

import { IconArrowLeft } from '@tabler/icons-react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  createAssetSchema,
  type CreateAssetInput,
  type UpdateAssetInput,
} from 'itam-shared/schemas/asset';
import { ASSET_STATUSES } from 'itam-shared/constants';
import type { AssetAttributeValueItem } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { assetQueries } from '~/api/asset.queries';
import { categoryQueries } from '~/api/category.queries';
import { modelAttributeValueQueries } from '~/api/model-attribute-value.queries';
import { modelQueries } from '~/api/model.queries';
import { categoryAttributeQueries } from '~/api/category-attribute.queries';
import { Button } from '~/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { useUpdateAsset } from '~/hooks/mutations/use-asset';
import { useAppForm } from '~/hooks/use-app-form';
import { AssetAttributeForm } from '~/routes/_app/asset/asset-attribute-form';

const ASSET_STATUS_OPTIONS = Object.values(ASSET_STATUSES).map((value) => ({
  label: value,
  value,
}));

const EditAssetPage = () => {
  const { t } = useTranslation('asset');
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const updateMutation = useUpdateAsset();
  const { data: assetData } = useSuspenseQuery(assetQueries.detail(id));
  const asset = assetData?.data;

  const [selectedCategoryId, setSelectedCategoryId] = useState(asset?.categoryId ?? '');
  const [selectedModelId, setSelectedModelId] = useState<string | null>(asset?.modelId ?? null);
  const [attributeValues, setAttributeValues] = useState<
    { attributeId: number; value: string | null }[]
  >(
    asset?.attributeValues?.map((av) => ({
      attributeId: av.attributeId,
      value: av.value,
    })) ?? [],
  );

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

  // Build the attribute list from asset detail (already includes full attribute info)
  const attributes: AssetAttributeValueItem[] =
    asset?.attributeValues ??
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

  // When user changes model, pre-fill attribute values from new model
  const [initialModelId] = useState(asset?.modelId ?? null);
  const [lastPrefilledModelId, setLastPrefilledModelId] = useState<string | null>(null);

  // Pre-fill when model data arrives after user selects a different model
  if (
    selectedModelId &&
    selectedModelId !== initialModelId &&
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

  type FormValues = Omit<CreateAssetInput, 'id' | 'attributeValues'>;

  const form = useAppForm({
    defaultValues: {
      assetCode: asset?.assetCode ?? null,
      name: asset?.name ?? '',
      categoryId: asset?.categoryId ?? '',
      modelId: asset?.modelId ?? null,
      vendorId: asset?.vendorId ?? null,
      purchaseDate: asset?.purchaseDate?.split('T')[0] ?? null,
      purchasePrice: asset?.purchasePrice != null ? Number(asset.purchasePrice) : null,
      warrantyStartDate: asset?.warrantyStartDate?.split('T')[0] ?? null,
      warrantyEndDate: asset?.warrantyEndDate?.split('T')[0] ?? null,
      warrantyMonth: asset?.warrantyMonth ?? null,
      serialNumber: asset?.serialNumber ?? null,
      location: asset?.location ?? null,
      maintenanceIntervalHours: asset?.maintenanceIntervalHours ?? null,
      quantity: asset?.quantity ?? 1,
      remainQuantity: asset?.remainQuantity ?? 1,
      qrCode: asset?.qrCode ?? null,
      assetStatus: asset?.assetStatus ?? ASSET_STATUSES.AVAILABLE,
      assignedTo: asset?.assignedTo ?? null,
      currentSection: asset?.currentSection ?? null,
    } as FormValues,
    validators: {
      onSubmit: createAssetSchema.omit({ id: true, attributeValues: true }),
    },
    onSubmit: async ({ value }) => {
      const payload: UpdateAssetInput & { id: string } = {
        id,
        ...value,
        attributeValues,
      };
      await updateMutation.mutateAsync(payload);
      navigate({ to: '/asset' });
    },
  });

  if (!asset) return null;

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
            <h1 className='text-foreground text-2xl font-bold'>
              {t('edit')} - {asset.name}
            </h1>
          </div>
          <div className='flex items-center gap-3'>
            <form.AppForm>
              <form.SubmitButton>{t('edit')}</form.SubmitButton>
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
                  <Field>
                    <FieldLabel>{t('form.id')}</FieldLabel>
                    <Input value={asset.id} disabled />
                  </Field>
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
          {attributes.length > 0 && (
            <>
              <Separator />
              <section>
                <h2 className='text-foreground mb-1 text-lg font-semibold'>
                  {t('sections.attributes')}
                </h2>
                {selectedModelId && selectedModelId !== initialModelId && (
                  <p className='text-muted-foreground mb-4 text-sm'>
                    {t('attributeForm.prefilledFromModel')}
                  </p>
                )}
                {!(selectedModelId && selectedModelId !== initialModelId) && (
                  <div className='mb-4' />
                )}
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

export const Route = createFileRoute('/_app/asset/$id/edit')({ component: EditAssetPage });
