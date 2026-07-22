import type { AssetStatus } from 'itam-shared/types';
import { ASSET_STATUSES } from 'itam-shared/constants';
import type { BatchAssetItem, CreateBatchAssetInput } from 'itam-shared/schemas/asset';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryQueries } from '~/api/category.queries';
import { modelQueries } from '~/api/model.queries';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { FieldGroup } from '~/components/ui/field';
import { Separator } from '~/components/ui/separator';
import { useCreateBatchAsset } from '~/hooks/mutations/use-asset';
import { useAppForm } from '~/hooks/use-app-form';

interface AssetBatchFormProps {
  onSuccess: () => void;
}

const ASSET_STATUS_OPTIONS = Object.values(ASSET_STATUSES).map((value) => ({
  label: value,
  value: value as AssetStatus,
}));

export function AssetBatchForm({ onSuccess }: AssetBatchFormProps) {
  const { t } = useTranslation('asset');
  const createBatchMutation = useCreateBatchAsset();
  const [step, setStep] = useState<1 | 2>(1);
  const [quantity, setQuantity] = useState(1);
  const [prefix, setPrefix] = useState('');
  const [startNumber, setStartNumber] = useState(1);
  const [items, setItems] = useState<BatchAssetItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

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
      const payload: CreateBatchAssetInput = {
        ...value,
        items,
      };
      await createBatchMutation.mutateAsync(payload);
      onSuccess();
    },
  });

  const generateItems = () => {
    const generated: BatchAssetItem[] = [];
    for (let i = 0; i < quantity; i++) {
      const num = String(startNumber + i).padStart(4, '0');
      generated.push({
        id: `${prefix}${num}`,
        assetCode: null,
        serialNumber: null,
      });
    }
    setItems(generated);
    setStep(2);
  };

  const updateItem = (index: number, field: keyof BatchAssetItem, value: string | null) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  if (step === 1) {
    return (
      <div className='space-y-4'>
        <FieldGroup>
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
              name='location'
              children={(field) => <field.TextField label={t('form.location')} />}
            />
            <form.AppField
              name='assetStatus'
              children={(field) => (
                <field.SelectField label={t('form.assetStatus')} options={statusOptions} />
              )}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <form.AppField
              name='assignedTo'
              children={(field) => <field.TextField label={t('form.assignedTo')} />}
            />
            <form.AppField
              name='currentSection'
              children={(field) => <field.TextField label={t('form.currentSection')} />}
            />
          </div>

          <Separator />

          <div className='grid grid-cols-2 gap-4'>
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
              name='purchaseDate'
              children={(field) => <field.DatePickerField label={t('form.purchaseDate')} />}
            />
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <form.AppField
              name='warrantyStartDate'
              children={(field) => <field.DatePickerField label={t('form.warrantyStartDate')} />}
            />
            <form.AppField
              name='warrantyEndDate'
              children={(field) => <field.DatePickerField label={t('form.warrantyEndDate')} />}
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
            name='maintenanceIntervalHours'
            children={(field) => (
              <field.NumberField
                label={t('form.maintenanceIntervalHours')}
                allowNegative={false}
                decimalScale={0}
              />
            )}
          />
        </FieldGroup>

        <Separator />

        <div>
          <h3 className='mb-3 text-sm font-medium'>{t('batch.generateTitle')}</h3>
          <div className='grid grid-cols-3 gap-4'>
            <div>
              <Label>{t('batch.prefix')}</Label>
              <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder='LT-' />
            </div>
            <div>
              <Label>{t('batch.startNumber')}</Label>
              <Input
                type='number'
                min={1}
                value={startNumber}
                onChange={(e) => setStartNumber(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>{t('batch.quantity')}</Label>
              <Input
                type='number'
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
          </div>
          <p className='text-muted-foreground mt-2 text-xs'>
            {t('batch.preview')}: {prefix}
            {String(startNumber).padStart(4, '0')} → {prefix}
            {String(startNumber + quantity - 1).padStart(4, '0')}
          </p>
        </div>

        <Button type='button' className='w-full' onClick={generateItems}>
          {t('batch.next')}
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium'>{t('batch.itemsTitle', { count: items.length })}</h3>
        <Button type='button' variant='outline' size='sm' onClick={() => setStep(1)}>
          {t('batch.back')}
        </Button>
      </div>

      <div className='max-h-80 overflow-y-auto rounded border'>
        <table className='w-full text-sm'>
          <thead className='bg-muted sticky top-0'>
            <tr>
              <th className='px-3 py-2 text-left'>#</th>
              <th className='px-3 py-2 text-left'>{t('columns.id')}</th>
              <th className='px-3 py-2 text-left'>{t('columns.assetCode')}</th>
              <th className='px-3 py-2 text-left'>{t('columns.serialNumber')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className='border-t'>
                <td className='text-muted-foreground px-3 py-1.5'>{index + 1}</td>
                <td className='px-3 py-1.5'>
                  <Input
                    value={item.id}
                    onChange={(e) => updateItem(index, 'id', e.target.value)}
                    className='h-8'
                  />
                </td>
                <td className='px-3 py-1.5'>
                  <Input
                    value={item.assetCode ?? ''}
                    onChange={(e) => updateItem(index, 'assetCode', e.target.value || null)}
                    className='h-8'
                  />
                </td>
                <td className='px-3 py-1.5'>
                  <Input
                    value={item.serialNumber ?? ''}
                    onChange={(e) => updateItem(index, 'serialNumber', e.target.value || null)}
                    className='h-8'
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        type='button'
        className='w-full'
        onClick={() => form.handleSubmit()}
        disabled={createBatchMutation.isPending}
      >
        {createBatchMutation.isPending
          ? t('batch.creating')
          : t('batch.submit', { count: items.length })}
      </Button>
    </div>
  );
}
