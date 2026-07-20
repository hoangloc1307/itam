import { createAssetSchema, type CreateAssetInput } from 'itam-shared/schemas/asset';
import type { Asset, AssetStatus } from 'itam-shared/types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryQueries } from '~/api/category.queries';
import { modelQueries } from '~/api/model.queries';
import { FieldGroup } from '~/components/ui/field';
import { useCreateAsset, useUpdateAsset } from '~/hooks/mutations/use-asset';
import { useAppForm } from '~/hooks/use-app-form';

interface AssetFormProps {
  asset: Asset | null;
  onSuccess: () => void;
}

const ASSET_STATUS_OPTIONS: { label: string; value: AssetStatus }[] = [
  { label: 'AVAILABLE', value: 'AVAILABLE' },
  { label: 'IN_USE', value: 'IN_USE' },
  { label: 'UNDER_REPAIR', value: 'UNDER_REPAIR' },
  { label: 'DISPOSED', value: 'DISPOSED' },
  { label: 'LOST', value: 'LOST' },
];

export function AssetForm({ asset, onSuccess }: AssetFormProps) {
  const { t } = useTranslation('asset');
  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();
  const isEditing = !!asset;
  const [selectedCategoryId, setSelectedCategoryId] = useState(asset?.categoryId ?? '');

  const { data: categoriesData } = useSuspenseQuery(categoryQueries.all());

  const { data: modelsData } = useQuery({
    ...modelQueries.all(selectedCategoryId || undefined),
    enabled: !!selectedCategoryId,
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

  const form = useAppForm({
    defaultValues: {
      id: asset?.id ?? '',
      assetCode: asset?.assetCode ?? null,
      name: asset?.name ?? '',
      categoryId: asset?.categoryId ?? '',
      modelId: asset?.modelId ?? null,
      vendorId: asset?.vendorId ?? null,
      purchaseDate: asset?.purchaseDate ?? null,
      purchasePrice: asset?.purchasePrice != null ? Number(asset.purchasePrice) : null,
      warrantyStartDate: asset?.warrantyStartDate ?? null,
      warrantyEndDate: asset?.warrantyEndDate ?? null,
      warrantyMonth: asset?.warrantyMonth ?? null,
      serialNumber: asset?.serialNumber ?? null,
      location: asset?.location ?? null,
      maintenanceIntervalHours: asset?.maintenanceIntervalHours ?? null,
      quantity: asset?.quantity ?? 1,
      remainQuantity: asset?.remainQuantity ?? 1,
      qrCode: asset?.qrCode ?? null,
      assetStatus: asset?.assetStatus ?? 'AVAILABLE',
      assignedTo: asset?.assignedTo ?? null,
      currentSection: asset?.currentSection ?? null,
    } satisfies CreateAssetInput,
    validators: {
      onSubmit: createAssetSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        const { id: _id, ...rest } = value;
        await updateMutation.mutateAsync({ id: asset.id, ...rest });
      } else {
        await createMutation.mutateAsync(value);
      }
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className='space-y-4'
    >
      <FieldGroup>
        <div className='grid grid-cols-2 gap-4'>
          <form.AppField
            name='id'
            children={(field) => <field.TextField label={t('form.id')} disabled={isEditing} />}
          />
          <form.AppField
            name='assetCode'
            children={(field) => <field.TextField label={t('form.assetCode')} />}
          />
        </div>

        <form.AppField
          name='name'
          children={(field) => <field.TextField label={t('form.name')} />}
        />

        <div className='grid grid-cols-2 gap-4'>
          <form.AppField
            name='categoryId'
            children={(field) => (
              <field.ComboboxField
                label={t('form.categoryId')}
                options={categoryOptions}
                onChange={(value) => {
                  setSelectedCategoryId(value);
                  form.setFieldValue('modelId', null);
                }}
              />
            )}
          />
          <form.AppField
            name='modelId'
            children={(field) => (
              <field.ComboboxField label={t('form.modelId')} options={modelOptions} />
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <form.AppField
            name='serialNumber'
            children={(field) => <field.TextField label={t('form.serialNumber')} />}
          />
          <form.AppField
            name='location'
            children={(field) => <field.TextField label={t('form.location')} />}
          />
        </div>

        <div className='grid grid-cols-3 gap-4'>
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

        <div className='grid grid-cols-2 gap-4'>
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

        <form.AppField
          name='assetStatus'
          children={(field) => (
            <field.SelectField label={t('form.assetStatus')} options={statusOptions} />
          )}
        />

        <form.AppForm>
          <form.SubmitButton>{isEditing ? t('edit') : t('addNew')}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
