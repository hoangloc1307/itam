import { createCategorySchema, type CreateCategoryInput } from 'itam-shared/schemas/category';
import type { Category, DocumentSequence } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import { useCreateCategory, useUpdateCategory } from '~/hooks/mutations/use-category';
import { useAppForm } from '~/hooks/use-app-form';

interface CategoryFormProps {
  category: Category | null;
  sequences: DocumentSequence[];
  onSuccess: () => void;
}

export function CategoryForm({ category, sequences, onSuccess }: CategoryFormProps) {
  const { t } = useTranslation('category');
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isEditing = !!category;

  const sequenceOptions = sequences
    .filter((s) => s.isActive)
    .map((s) => ({
      label: `${s.code} - ${s.name}`,
      value: s.code,
    }));

  const form = useAppForm({
    defaultValues: {
      id: category?.id ?? '',
      name: category?.name ?? '',
      serialKey: category?.serialKey ?? '',
      maintenanceIntervalHours: category?.maintenanceIntervalHours ?? null,
      isActive: category?.isActive ?? true,
    } satisfies CreateCategoryInput,
    validators: {
      onSubmit: createCategorySchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        const { id: _id, ...rest } = value;
        await updateMutation.mutateAsync({ id: category.id, ...rest });
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
          children={(field) => <field.TextField label={t('form.id')} disabled={isEditing} />}
        />
        <form.AppField
          name='name'
          children={(field) => <field.TextField label={t('form.name')} />}
        />
        <form.AppField
          name='serialKey'
          children={(field) => (
            <field.ComboboxField
              label={t('form.serialKey')}
              placeholder={t('form.serialKeyPlaceholder')}
              options={sequenceOptions}
            />
          )}
        />
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
            name='isActive'
            children={(field) => <field.SwitchButton label={t('form.isActive')} />}
          />
        </div>

        <form.AppForm>
          <form.SubmitButton>{isEditing ? t('edit') : t('addNew')}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
