import {
  createAttributeGroupSchema,
  type CreateAttributeGroupInput,
} from 'itam-shared/schemas/attribute-group';
import type { AttributeGroup } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import {
  useCreateAttributeGroup,
  useUpdateAttributeGroup,
} from '~/hooks/mutations/use-attribute-group';
import { useAppForm } from '~/hooks/use-app-form';

interface AttributeGroupFormProps {
  group: AttributeGroup | null;
  onSuccess: () => void;
}

export function AttributeGroupForm({ group, onSuccess }: AttributeGroupFormProps) {
  const { t } = useTranslation('attributeGroup');
  const createMutation = useCreateAttributeGroup();
  const updateMutation = useUpdateAttributeGroup();
  const isEditing = !!group;

  const form = useAppForm({
    defaultValues: {
      name: group?.name ?? '',
      sortOrder: group?.sortOrder ?? 0,
      isActive: group?.isActive ?? true,
    } satisfies CreateAttributeGroupInput,
    validators: {
      onSubmit: createAttributeGroupSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: group.id, ...value });
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
          children={(field) => (
            <field.TextField
              label={t('form.name')}
              required
              placeholder={t('form.namePlaceholder')}
            />
          )}
        />

        <form.AppField
          name='sortOrder'
          children={(field) => <field.NumberField label={t('form.sortOrder')} />}
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
