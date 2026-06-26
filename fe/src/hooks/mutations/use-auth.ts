import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { authApi } from '~/api/auth';
import { useAuthStore } from '~/stores/auth';
import type { LoginInput } from 'itam-shared/schemas/auth';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginInput) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth({ token: data.token, user: data.user });
      router.navigate({ to: '/dashboard' });
    },
  });
}
