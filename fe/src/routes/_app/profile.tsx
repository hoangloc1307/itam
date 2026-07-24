import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { changePasswordSchema } from 'itam-shared/schemas/auth';
import { useChangePassword } from '~/hooks/mutations/use-auth';
import { useAppForm } from '~/hooks/use-app-form';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { authApi } from '~/api/auth';

const profileQueryOptions = queryOptions({
  queryKey: ['profile'],
  queryFn: () => authApi.getProfile(),
});

const ProfilePage = () => {
  const { t } = useTranslation('auth');
  const { data } = useSuspenseQuery(profileQueryOptions);
  const profile = data?.data;

  return (
    <div className='space-y-6'>
      <h2 className='text-foreground text-2xl font-bold'>{t('profile.title')}</h2>

      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='bg-popover rounded-xl border p-6'>
          <h3 className='text-foreground text-lg font-semibold'>{t('profile.info')}</h3>
          <p className='text-muted-foreground mt-1 text-sm'>{t('profile.infoDescription')}</p>

          <div className='mt-6 flex items-center gap-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage
                src={`https://v033.nok.com.vn/shared/images/${profile?.username}.jpg`}
                alt={profile?.name}
                className='object-fill'
              />
              <AvatarFallback className='text-lg' style={{ backgroundColor: '#E57373' }}>
                {profile?.name?.slice(0, 2).toUpperCase() ?? 'US'}
              </AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
              <p className='text-foreground text-lg font-medium'>{profile?.name}</p>
              <p className='text-muted-foreground text-sm'>{profile?.username}</p>
            </div>
          </div>

          <div className='mt-6 grid gap-4 sm:grid-cols-2'>
            <div>
              <p className='text-muted-foreground text-sm'>{t('name')}</p>
              <p className='text-foreground font-medium'>{profile?.name || '—'}</p>
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>{t('email')}</p>
              <p className='text-foreground font-medium'>{profile?.email || '—'}</p>
            </div>
          </div>

          {profile?.roles && profile.roles.length > 0 && (
            <div className='mt-6'>
              <p className='text-muted-foreground text-sm'>{t('profile.roles')}</p>
              <div className='mt-2 flex flex-wrap gap-2'>
                {profile.roles.map((role) => (
                  <Badge key={`${role.roleCode}-${role.section}`} variant='secondary'>
                    {role.roleName}
                    {role.section && (
                      <span className='text-muted-foreground ml-1'>({role.section})</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <ChangePasswordCard />
      </div>
    </div>
  );
};

const ChangePasswordCard = () => {
  const { t } = useTranslation('auth');
  const { mutateAsync } = useChangePassword();

  const form = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
      form.reset();
    },
  });

  return (
    <div className='bg-popover rounded-xl border p-6'>
      <h3 className='text-foreground text-lg font-semibold'>{t('profile.changePassword')}</h3>
      <p className='text-muted-foreground mt-1 text-sm'>{t('profile.changePasswordDescription')}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className='mt-6 space-y-4'
      >
        <form.AppField name='currentPassword'>
          {(field) => (
            <field.TextField
              label={t('profile.currentPassword')}
              type='password'
              required
              autoComplete='current-password'
            />
          )}
        </form.AppField>

        <form.AppField name='newPassword'>
          {(field) => (
            <field.TextField
              label={t('profile.newPassword')}
              type='password'
              required
              autoComplete='new-password'
            />
          )}
        </form.AppField>

        <form.AppField name='confirmPassword'>
          {(field) => (
            <field.TextField
              label={t('profile.confirmPassword')}
              type='password'
              required
              autoComplete='new-password'
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton>{t('profile.submit')}</form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
};

export const Route = createFileRoute('/_app/profile')({ component: ProfilePage });
