import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { loginSchema, type LoginInput } from 'itam-shared/schemas/auth';
import { FieldDescription, FieldGroup } from '~/components/ui/field';
import { useAppForm } from '~/hooks/use-app-form';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  const form = useAppForm({
    defaultValues: {
      username: '',
      password: '',
    } satisfies LoginInput,
    validators: {
      onBlur: loginSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
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
        <h2 className='text-2xl font-bold'>{t('welcome')}</h2>
        <p className='text-muted-foreground text-balance'>{t('loginToVNN')}</p>
      </div>
      <FieldGroup className='mt-4'>
        <form.AppField
          name='username'
          children={(field) => <field.TextField label={t('username')} />}
        />
        <form.AppField
          name='password'
          children={(field) => <field.TextField label={t('password')} type='password' />}
        />
        <form.AppForm>
          <form.SubmitButton>{t('login')}</form.SubmitButton>
        </form.AppForm>

        <FieldDescription className='text-center'>
          {t('doNotHaveAccount')} <Link to='/register'>{t('signUp')}</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
};

export const Route = createFileRoute('/_auth/login')({ component: LoginPage });
