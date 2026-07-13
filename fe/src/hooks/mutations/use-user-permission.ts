import { useQueryClient } from '@tanstack/react-query';
import type {
  CreateUserPermissionInput,
  SyncUserPermissionsInput,
  UpdateUserPermissionInput,
} from 'itam-shared/schemas/user-permission';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { userPermissionApi } from '~/api/user-permission';
import { userPermissionQueries } from '~/api/user-permission.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateUserPermission() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('userPermission');

  return useAppMutation({
    mutationFn: (payload: CreateUserPermissionInput) => userPermissionApi.create(payload),
    onSuccess: (_data, variables) => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({
        queryKey: userPermissionQueries.byUser(variables.username).queryKey,
      });
    },
  });
}

export function useUpdateUserPermission() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('userPermission');

  return useAppMutation({
    mutationFn: ({
      id,
      username: _username,
      ...payload
    }: UpdateUserPermissionInput & { id: number; username: string }) =>
      userPermissionApi.update(id, payload),
    onSuccess: (_data, variables) => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({
        queryKey: userPermissionQueries.byUser(variables.username).queryKey,
      });
    },
  });
}

export function useSyncUserPermissions() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('userPermission');

  return useAppMutation({
    mutationFn: (payload: SyncUserPermissionsInput) => userPermissionApi.sync(payload),
    onSuccess: (_data, variables) => {
      toast.success(t('syncSuccess'));
      queryClient.invalidateQueries({
        queryKey: userPermissionQueries.byUser(variables.username).queryKey,
      });
    },
  });
}

export function useDeleteUserPermission() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('userPermission');

  return useAppMutation({
    mutationFn: ({ id, username: _username }: { id: number; username: string }) =>
      userPermissionApi.remove(id),
    onSuccess: (_data, variables) => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: userPermissionQueries.byUser(variables.username).queryKey,
      });
    },
  });
}
