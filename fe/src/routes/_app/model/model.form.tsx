import { createModelSchema, type CreateModelInput } from 'itam-shared/schemas/model';
import type { Category, Model } from 'itam-shared/types';
import { MANAGE_TYPES } from 'itam-shared/constants';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import { useCreateModel, useUpdateModel } from '~/hooks/mutations/use-model';
import { useAppForm } from '~/hooks/use-app-form';

interface ModelFormProps {
  model: Model | null;
  categories: Category[];
  onSuccess: () => void;
}

export function ModelForm({ model, categories, onSuccess }: ModelFormProps) {
  const { t } = useTranslation('model');
  const createMutation = useCreateModel();
  const updateMutation = useUpdateModel();
  const isEditing = !!model;

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const manageTypeOptions = [
    { label: t('manageTypes.individual'), value: MANAGE_TYPES.INDIVIDUAL },
    { label: t('manageTypes.bulk'), value: MANAGE_TYPES.BULK },
  ];

  const form = useAppForm({
    defaultValues: {
      id: model?.id ?? '',
      categoryId: model?.categoryId ?? '',
      manufacturer: model?.manufacturer ?? '',
      name: model?.name ?? '',
      manageType: model?.manageType ?? '',
      modelCode: model?.modelCode ?? '',
      isActive: model?.isActive ?? true,
    } satisfies CreateModelInput,
    validators: {
      onSubmit: createModelSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        const { id: _id, ...rest } = value;
        await updateMutation.mutateAsync({ id: model.id, ...rest });
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
        <form.AppField
          name='id'
          children={(field) => (
            <field.TextField label={t('form.id')} required disabled={isEditing} />
          )}
        />
        <form.AppField
          name='name'
          children={(field) => <field.TextField label={t('form.name')} required />}
        />
        <form.AppField
          name='categoryId'
          children={(field) => (
            <field.ComboboxField
              label={t('form.categoryId')}
              required
              options={categoryOptions}
              placeholder={t('form.categoryIdPlaceholder')}
            />
          )}
        />
        <div className='grid grid-cols-2 gap-4'>
          <form.AppField
            name='manageType'
            children={(field) => (
              <field.SelectField label={t('form.manageType')} options={manageTypeOptions} />
            )}
          />
          <form.AppField
            name='modelCode'
            children={(field) => <field.TextField label={t('form.modelCode')} />}
          />
        </div>
        <form.AppField
          name='manufacturer'
          children={(field) => <field.TextField label={t('form.manufacturer')} />}
        />

        <form.AppField
          name='isActive'
          children={(field) => <field.SwitchButton label={t('form.isActive')} />}
        />

        <form.AppForm>
          <form.SubmitButton>{isEditing ? t('edit') : t('addNew')}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
