import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { forgotPasswordSchema, resetPasswordSchema } from 'itam-shared/schemas/auth';
import { FieldDescription, FieldGroup } from '~/components/ui/field';
import { useForgotPassword, useResetPassword } from '~/hooks/mutations/use-auth';
import { useAppForm } from '~/hooks/use-app-form';

const ForgotPasswordPage = () => {
  const { t } = useTranslation('auth');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [username, setUsername] = useState('');

  return (
    <div className='p-6 md:p-8'>
      {step === 'request' ? (
        <RequestCodeStep
          onSuccess={(uname) => {
            setUsername(uname);
            setStep('reset');
          }}
        />
      ) : (
        <ResetPasswordStep username={username} />
      )}

      <FieldDescription className='mt-4! text-center'>
        <Link to='/login'>{t('backToLogin')}</Link>
      </FieldDescription>
    </div>
  );
};

const RequestCodeStep = ({ onSuccess }: { onSuccess: (username: string) => void }) => {
  const { t } = useTranslation('auth');
  const { mutateAsync } = useForgotPassword();

  const form = useAppForm({
    defaultValues: {
      username: '',
      email: '',
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
      onSuccess(value.username);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h2 className='text-2xl font-bold'>{t('forgotPasswordTitle')}</h2>
        <p className='text-muted-foreground text-balance'>{t('forgotPasswordDescription')}</p>
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
        <form.AppForm>
          <form.SubmitButton>{t('sendCode')}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};

const ResetPasswordStep = ({ username }: { username: string }) => {
  const { t } = useTranslation('auth');
  const { mutateAsync } = useResetPassword();

  const form = useAppForm({
    defaultValues: {
      username,
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h2 className='text-2xl font-bold'>{t('resetPassword')}</h2>
        <p className='text-muted-foreground text-balance'>{t('resetPasswordDescription')}</p>
      </div>
      <FieldGroup className='mt-4'>
        <form.AppField
          name='code'
          children={(field) => (
            <field.TextField
              label={t('verificationCode')}
              maxLength={6}
              autoComplete='one-time-code'
            />
          )}
        />
        <form.AppField
          name='newPassword'
          children={(field) => (
            <field.TextField label={t('newPassword')} type='password' autoComplete='new-password' />
          )}
        />
        <form.AppField
          name='confirmPassword'
          children={(field) => (
            <field.TextField
              label={t('confirmPassword')}
              type='password'
              autoComplete='new-password'
            />
          )}
        />
        <form.AppForm>
          <form.SubmitButton>{t('resetSubmit')}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};

export const Route = createFileRoute('/_auth/forgot-password')({ component: ForgotPasswordPage });
