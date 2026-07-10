import { useQueryClient } from '@tanstack/react-query';
import type { CreateUserInput, UpdateUserInput } from 'itam-shared/schemas/user';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { userApi } from '~/api/user';
import { userQueries } from '~/api/user.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('user');

  return useAppMutation({
    mutationFn: (payload: CreateUserInput) => userApi.create(payload),
    onSuccess: () => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: userQueries.all().queryKey });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('user');

  return useAppMutation({
    mutationFn: ({ username, ...payload }: UpdateUserInput & { username: string }) =>
      userApi.update(username, payload),
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({ queryKey: userQueries.all().queryKey });
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('user');

  return useAppMutation({
    mutationFn: (username: string) => userApi.resetPassword(username),
    onSuccess: () => {
      toast.success(t('resetPasswordSuccess'));
      queryClient.invalidateQueries({ queryKey: userQueries.all().queryKey });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('user');

  return useAppMutation({
    mutationFn: (username: string) => userApi.remove(username),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: userQueries.all().queryKey });
    },
  });
}
