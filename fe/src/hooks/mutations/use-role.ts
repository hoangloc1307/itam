import { useQueryClient } from '@tanstack/react-query';
import type { CreateRoleInput, UpdateRoleInput } from 'itam-shared/schemas/role';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { roleApi } from '~/api/role';
import { roleQueries } from '~/api/role.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateRole() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('role');

  return useAppMutation({
    mutationFn: (payload: CreateRoleInput) => roleApi.create(payload),
    onSuccess: () => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: roleQueries.all().queryKey });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('role');

  return useAppMutation({
    mutationFn: ({ code, ...payload }: UpdateRoleInput & { code: string }) =>
      roleApi.update(code, payload),
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({ queryKey: roleQueries.all().queryKey });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('role');

  return useAppMutation({
    mutationFn: (code: string) => roleApi.remove(code),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: roleQueries.all().queryKey });
    },
  });
}
