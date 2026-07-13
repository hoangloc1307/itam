import {
  createRolePermissionSchema,
  updateRolePermissionSchema,
  type CreateRolePermissionInput,
  type UpdateRolePermissionInput,
} from 'itam-shared/schemas/role-permission';
import type { Feature, Role, RolePermission } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import {
  useCreateRolePermission,
  useUpdateRolePermission,
} from '~/hooks/mutations/use-role-permission';
import { useAppForm } from '~/hooks/use-app-form';
import { ACTIONS } from 'itam-shared/constants';

interface RolePermissionFormProps {
  roleCode: string;
  roles: Role[];
  features: Feature[];
  editData?: RolePermission | null;
  onSuccess: () => void;
}

const ACTION_OPTIONS = Object.values(ACTIONS).map((action) => ({
  label: action,
  value: action,
}));

export function RolePermissionForm({
  roleCode,
  features,
  editData,
  onSuccess,
}: RolePermissionFormProps) {
  const { t } = useTranslation('rolePermission');
  const createMutation = useCreateRolePermission();
  const updateMutation = useUpdateRolePermission();

  const isEdit = !!editData;

  const featureOptions = features.map((f) => ({
    label: f.name,
    value: f.code,
  }));

  const form = useAppForm({
    defaultValues: isEdit
      ? ({
          featureCode: editData.featureCode,
          action: editData.action,
          section: editData.section,
        } as UpdateRolePermissionInput)
      : ({
          roleCode,
          featureCode: '',
          action: '',
          section: null,
        } as CreateRolePermissionInput),
    validators: {
      onSubmit: isEdit ? updateRolePermissionSchema : createRolePermissionSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: editData.id,
          roleCode,
          ...(value as UpdateRolePermissionInput),
        });
      } else {
        await createMutation.mutateAsync(value as CreateRolePermissionInput);
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
          name='featureCode'
          children={(field) => (
            <field.SelectField label={t('form.featureCode')} options={featureOptions} />
          )}
        />
        <form.AppField
          name='action'
          children={(field) => (
            <field.SelectField label={t('form.action')} options={ACTION_OPTIONS} />
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
