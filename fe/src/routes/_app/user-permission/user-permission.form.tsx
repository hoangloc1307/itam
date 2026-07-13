import {
  createUserPermissionSchema,
  updateUserPermissionSchema,
  type CreateUserPermissionInput,
  type UpdateUserPermissionInput,
} from 'itam-shared/schemas/user-permission';
import type { Feature, UserPermission } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import {
  useCreateUserPermission,
  useUpdateUserPermission,
} from '~/hooks/mutations/use-user-permission';
import { useAppForm } from '~/hooks/use-app-form';
import { ACTIONS } from 'itam-shared/constants';

interface UserPermissionFormProps {
  username: string;
  features: Feature[];
  editData?: UserPermission | null;
  onSuccess: () => void;
}

const ACTION_OPTIONS = Object.values(ACTIONS).map((action) => ({
  label: action,
  value: action,
}));

const DECISION_OPTIONS = [
  { label: 'ALLOW', value: 'ALLOW' },
  { label: 'DENY', value: 'DENY' },
];

export function UserPermissionForm({
  username,
  features,
  editData,
  onSuccess,
}: UserPermissionFormProps) {
  const { t } = useTranslation('userPermission');
  const createMutation = useCreateUserPermission();
  const updateMutation = useUpdateUserPermission();

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
          decision: editData.decision,
          section: editData.section,
        } as UpdateUserPermissionInput)
      : ({
          username,
          featureCode: '',
          action: '',
          decision: 'ALLOW' as const,
          section: null,
        } as CreateUserPermissionInput),
    validators: {
      onSubmit: isEdit ? updateUserPermissionSchema : createUserPermissionSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: editData.id,
          username,
          ...(value as UpdateUserPermissionInput),
        });
      } else {
        await createMutation.mutateAsync(value as CreateUserPermissionInput);
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
          name='decision'
          children={(field) => (
            <field.SelectField label={t('form.decision')} options={DECISION_OPTIONS} />
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
