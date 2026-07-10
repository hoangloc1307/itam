import { createUserSchema, type CreateUserInput } from 'itam-shared/schemas/user';
import type { User } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import { useCreateUser, useUpdateUser } from '~/hooks/mutations/use-user';
import { useAppForm } from '~/hooks/use-app-form';

interface UserFormProps {
  user: User | null;
  onSuccess: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const { t } = useTranslation('user');
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isEditing = !!user;

  const form = useAppForm({
    defaultValues: {
      username: user?.username ?? '',
      name: user?.name ?? '',
      email: user?.email ?? '',
      isActive: user?.isActive ?? true,
    } satisfies CreateUserInput,
    validators: {
      onSubmit: createUserSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        const { username: _username, ...rest } = value;
        await updateMutation.mutateAsync({ username: user.username, ...rest });
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
          name='username'
          children={(field) => (
            <field.TextField
              label={t('form.username')}
              placeholder={t('form.usernamePlaceholder')}
              disabled={isEditing}
            />
          )}
        />
        <form.AppField
          name='name'
          children={(field) => (
            <field.TextField label={t('form.name')} placeholder={t('form.namePlaceholder')} />
          )}
        />
        <form.AppField
          name='email'
          children={(field) => (
            <field.TextField label={t('form.email')} placeholder={t('form.emailPlaceholder')} />
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
