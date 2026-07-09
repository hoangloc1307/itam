import {
  createAttributeSchema,
  attributeDataTypes,
  type CreateAttributeInput,
} from 'itam-shared/schemas/attribute';
import type { Attribute } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import { useCreateAttribute, useUpdateAttribute } from '~/hooks/mutations/use-attribute';
import { useAppForm } from '~/hooks/use-app-form';

interface AttributeFormProps {
  attribute: Attribute | null;
  onSuccess: () => void;
}

export function AttributeForm({ attribute, onSuccess }: AttributeFormProps) {
  const { t } = useTranslation('attribute');
  const createMutation = useCreateAttribute();
  const updateMutation = useUpdateAttribute();
  const isEditing = !!attribute;

  const form = useAppForm({
    defaultValues: {
      name: attribute?.name ?? '',
      measurementUnit: attribute?.measurementUnit ?? null,
      dataType: attribute?.dataType ?? 'TEXT',
      options: attribute?.options ?? null,
      isActive: attribute?.isActive ?? true,
    } satisfies CreateAttributeInput,
    validators: {
      onSubmit: createAttributeSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: attribute.id, ...value });
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
          name='name'
          children={(field) => <field.TextField label={t('form.name')} />}
        />

        <div className='grid grid-cols-2 gap-4'>
          <form.AppField
            name='measurementUnit'
            children={(field) => <field.TextField label={t('form.measurementUnit')} />}
          />

          <form.AppField
            name='dataType'
            children={(field) => (
              <field.SelectField
                label={t('form.dataType')}
                options={attributeDataTypes.map((type) => ({
                  value: type,
                  label: t(`dataTypes.${type}`),
                }))}
              />
            )}
          />
        </div>

        <form.AppField
          name='options'
          children={(field) => (
            <field.TagInput label={t('form.options')} placeholder={t('form.optionsPlaceholder')} />
          )}
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
