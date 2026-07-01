import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { registerSchema, type RegisterInput } from 'itam-shared/schemas/auth';
import { FieldDescription, FieldGroup } from '~/components/ui/field';
import { useRegister } from '~/hooks/mutations/use-auth';
import { useAppForm } from '~/hooks/use-app-form';

const RegisterPage = () => {
  const { t } = useTranslation('auth');
  const { mutateAsync } = useRegister();

  const form = useAppForm({
    defaultValues: {
      username: '',
      email: '',
      name: '',
    } satisfies RegisterInput,
    validators: {
      onBlur: registerSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
    },
  });

  return (
    <form
      className='p-6 md:p-8'
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h2 className='text-2xl font-bold'>{t('createAccount')}</h2>
        <p className='text-muted-foreground text-balance'>{t('registerVNN')}</p>
      </div>
      <FieldGroup className='mt-4'>
        <form.AppField
          name='username'
          children={(field) => <field.TextField label={t('username')} />}
        />
        <form.AppField
          name='email'
          children={(field) => <field.TextField label={t('email')} type='email' />}
        />
        <form.AppField name='name' children={(field) => <field.TextField label={t('name')} />} />
        <form.AppForm>
          <form.SubmitButton>{t('register')}</form.SubmitButton>
        </form.AppForm>

        <FieldDescription className='text-center'>
          {t('alreadyHaveAccount')} <Link to='/login'>{t('signIn')}</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
};

export const Route = createFileRoute('/_auth/register')({ component: RegisterPage });
