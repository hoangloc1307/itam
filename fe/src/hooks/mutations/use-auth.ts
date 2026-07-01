import { useRouter } from '@tanstack/react-router';
import type { LoginInput } from 'itam-shared/schemas/auth';
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
        router.invalidate().then(() => {
          router.navigate({ to: '/dashboard' });
        });
      }
    },
  });
}
