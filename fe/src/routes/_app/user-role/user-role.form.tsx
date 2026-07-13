import {
  createUserRoleSchema,
  updateUserRoleSchema,
  type CreateUserRoleInput,
  type UpdateUserRoleInput,
} from 'itam-shared/schemas/user-role';
import type { Role, UserRole } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import { useCreateUserRole, useUpdateUserRole } from '~/hooks/mutations/use-user-role';
import { useAppForm } from '~/hooks/use-app-form';

interface UserRoleFormProps {
  username: string;
  roles: Role[];
  editData?: UserRole | null;
  onSuccess: () => void;
}

export function UserRoleForm({ username, roles, editData, onSuccess }: UserRoleFormProps) {
  const { t } = useTranslation('userRole');
  const createMutation = useCreateUserRole();
  const updateMutation = useUpdateUserRole();

  const isEdit = !!editData;

  const roleOptions = roles.map((r) => ({
    label: r.name,
    value: r.code,
  }));

  const form = useAppForm({
    defaultValues: isEdit
      ? ({
          roleCode: editData.roleCode,
          section: editData.section,
        } as UpdateUserRoleInput)
      : ({
          username,
          roleCode: '',
          section: null,
        } as CreateUserRoleInput),
    validators: {
      onSubmit: isEdit ? updateUserRoleSchema : createUserRoleSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: editData.id,
          username,
          ...(value as UpdateUserRoleInput),
        });
      } else {
        await createMutation.mutateAsync(value as CreateUserRoleInput);
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
          name='roleCode'
          children={(field) => (
            <field.SelectField label={t('form.roleCode')} options={roleOptions} />
          )}
        />
        <form.AppField
          name='section'
          children={(field) => <field.TextField label={t('form.section')} />}
        />

        <form.AppForm>
          <form.SubmitButton>{isEdit ? t('edit') : t('addNew')}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
