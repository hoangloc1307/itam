import { useRouter } from '@tanstack/react-router';
import type { LoginInput, RegisterInput } from 'itam-shared/schemas/auth';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { authApi } from '~/api/auth';
import { useAppMutation } from '~/hooks/use-app-mutation';
import { useAuthStore } from '~/stores/auth';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useAppMutation({
    mutationFn: (payload: LoginInput) => authApi.login(payload),
    onSuccess: (data) => {
      if (data.data) {
        setAuth({ token: data.data.token, user: data.data.user });
        router.navigate({ to: '/dashboard', replace: true });
      }
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { t } = useTranslation('auth');

  return useAppMutation({
    mutationFn: (payload: RegisterInput) => authApi.register(payload),
    onSuccess: () => {
      toast.success(t('registerSuccess'));
      router.navigate({ to: '/login', replace: true });
    },
  });
}
