import { useQueryClient } from '@tanstack/react-query';
import type {
  CreateUserRoleInput,
  SyncUserRolesInput,
  UpdateUserRoleInput,
} from 'itam-shared/schemas/user-role';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { userRoleApi } from '~/api/user-role';
import { userRoleQueries } from '~/api/user-role.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateUserRole() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('userRole');

  return useAppMutation({
    mutationFn: (payload: CreateUserRoleInput) => userRoleApi.create(payload),
    onSuccess: (_data, variables) => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({
        queryKey: userRoleQueries.byUser(variables.username).queryKey,
      });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('userRole');

  return useAppMutation({
    mutationFn: ({
      id,
      username: _username,
      ...payload
    }: UpdateUserRoleInput & { id: number; username: string }) => userRoleApi.update(id, payload),
    onSuccess: (_data, variables) => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({
        queryKey: userRoleQueries.byUser(variables.username).queryKey,
      });
    },
  });
}

export function useSyncUserRoles() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('userRole');

  return useAppMutation({
    mutationFn: (payload: SyncUserRolesInput) => userRoleApi.sync(payload),
    onSuccess: (_data, variables) => {
      toast.success(t('syncSuccess'));
      queryClient.invalidateQueries({
        queryKey: userRoleQueries.byUser(variables.username).queryKey,
      });
    },
  });
}

export function useDeleteUserRole() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('userRole');

  return useAppMutation({
    mutationFn: ({ id, username: _username }: { id: number; username: string }) =>
      userRoleApi.remove(id),
    onSuccess: (_data, variables) => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: userRoleQueries.byUser(variables.username).queryKey,
      });
    },
  });
}
