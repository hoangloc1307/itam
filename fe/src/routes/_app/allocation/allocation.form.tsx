'use no memo';

import { useQuery } from '@tanstack/react-query';
import type { CreateAllocationInput } from 'itam-shared/schemas/allocation';
import { createAllocationSchema } from 'itam-shared/schemas/allocation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { assetQueries } from '~/api/asset.queries';
import { Separator } from '~/components/ui/separator';
import { useAppForm } from '~/hooks/use-app-form';
import { useCreateAllocation } from '~/hooks/mutations/use-allocation';

interface AllocationFormProps {
  onSuccess: () => void;
}

export function AllocationForm({ onSuccess }: AllocationFormProps) {
  const { t } = useTranslation('allocation');
  const createMutation = useCreateAllocation();
  const [isIndividual, setIsIndividual] = useState(false);

  const { data: assetsData } = useQuery(assetQueries.all());
  const assets = assetsData?.data ?? [];

  const assetOptions = assets
    .filter((a) => a.remainQuantity > 0)
    .map((asset) => ({
      label: `${asset.assetCode || asset.id} — ${asset.name}`,
      value: asset.id,
    }));

  const handleAssetChange = (assetId: string) => {
    const selected = assets.find((a) => a.id === assetId);
    setIsIndividual(selected ? selected.quantity === 1 : false);
  };

  const form = useAppForm({
    defaultValues: {
      assetId: '',
      assetCode: null as string | null,
      employeeId: null as string | null,
      sectionId: null as string | null,
      quantity: 1,
      assignedDate: new Date().toISOString().slice(0, 10),
      requestNo: null as string | null,
      note: null as string | null,
    },
    validators: {
      onSubmit: createAllocationSchema as unknown as undefined,
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync(value as CreateAllocationInput);
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className='space-y-4'
    >
      <form.AppField
        name='assetId'
        children={(field) => (
          <field.ComboboxField
            label={t('form.assetId')}
            options={assetOptions}
            placeholder={t('form.assetPlaceholder')}
            onChange={handleAssetChange}
          />
        )}
      />

      {isIndividual && (
        <form.AppField
          name='assetCode'
          children={(field) => <field.TextField label={t('form.assetCode')} />}
        />
      )}

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField
          name='employeeId'
          children={(field) => <field.TextField label={t('form.employeeId')} />}
        />
        <form.AppField
          name='sectionId'
          children={(field) => <field.TextField label={t('form.sectionId')} />}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <form.AppField
          name='quantity'
          children={(field) => (
            <field.NumberField label={t('form.quantity')} allowNegative={false} decimalScale={0} />
          )}
        />
        <form.AppField
          name='assignedDate'
          children={(field) => <field.DatePickerField label={t('form.assignedDate')} />}
        />
      </div>

      <form.AppField
        name='requestNo'
        children={(field) => <field.TextField label={t('form.requestNo')} />}
      />

      <form.AppField name='note' children={(field) => <field.TextField label={t('form.note')} />} />

      <Separator />

      <form.AppForm>
        <form.SubmitButton>{t('form.submit')}</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}
