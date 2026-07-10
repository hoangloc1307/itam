import { createRoleSchema, type CreateRoleInput } from 'itam-shared/schemas/role';
import type { Role } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import { useCreateRole, useUpdateRole } from '~/hooks/mutations/use-role';
import { useAppForm } from '~/hooks/use-app-form';

interface RoleFormProps {
  role: Role | null;
  onSuccess: () => void;
}

export function RoleForm({ role, onSuccess }: RoleFormProps) {
  const { t } = useTranslation('role');
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const isEditing = !!role;

  const form = useAppForm({
    defaultValues: {
      code: role?.code ?? '',
      name: role?.name ?? '',
      isActive: role?.isActive ?? true,
    } satisfies CreateRoleInput,
    validators: {
      onSubmit: createRoleSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        const { code: _code, ...rest } = value;
        await updateMutation.mutateAsync({ code: role.code, ...rest });
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
          name='code'
          children={(field) => <field.TextField label={t('form.code')} disabled={isEditing} />}
        />
        <form.AppField
          name='name'
          children={(field) => <field.TextField label={t('form.name')} />}
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
