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
  existingRoles: UserRole[];
  editData?: UserRole | null;
  onSuccess: () => void;
}

export function UserRoleForm({
  username,
  roles,
  existingRoles,
  editData,
  onSuccess,
}: UserRoleFormProps) {
  const { t } = useTranslation('userRole');
  const createMutation = useCreateUserRole();
  const updateMutation = useUpdateUserRole();

  const isEdit = !!editData;

  // Chỉ hiện roles chưa được gán cho user này
  const assignedRoleCodes = new Set(existingRoles.map((ur) => ur.roleCode));
  const roleOptions = roles
    .filter((r) => isEdit || !assignedRoleCodes.has(r.code))
    .map((r) => ({
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
            <field.ComboboxField
              label={t('form.roleCode')}
              required
              placeholder={t('form.roleCodePlaceholder')}
              options={roleOptions}
              disabled={isEdit}
            />
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
