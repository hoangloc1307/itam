import { useQueryClient } from '@tanstack/react-query';
import type {
  CreateRolePermissionInput,
  SyncRolePermissionsInput,
  UpdateRolePermissionInput,
} from 'itam-shared/schemas/role-permission';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { rolePermissionApi } from '~/api/role-permission';
import { rolePermissionQueries } from '~/api/role-permission.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateRolePermission() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('rolePermission');

  return useAppMutation({
    mutationFn: (payload: CreateRolePermissionInput) => rolePermissionApi.create(payload),
    onSuccess: (_data, variables) => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({
        queryKey: rolePermissionQueries.byRole(variables.roleCode).queryKey,
      });
    },
  });
}

export function useUpdateRolePermission() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('rolePermission');

  return useAppMutation({
    mutationFn: ({
      id,
      roleCode: _roleCode,
      ...payload
    }: UpdateRolePermissionInput & { id: number; roleCode: string }) =>
      rolePermissionApi.update(id, payload),
    onSuccess: (_data, variables) => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({
        queryKey: rolePermissionQueries.byRole(variables.roleCode).queryKey,
      });
    },
  });
}

export function useSyncRolePermissions() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('rolePermission');

  return useAppMutation({
    mutationFn: (payload: SyncRolePermissionsInput) => rolePermissionApi.sync(payload),
    onSuccess: (_data, variables) => {
      toast.success(t('syncSuccess'));
      queryClient.invalidateQueries({
        queryKey: rolePermissionQueries.byRole(variables.roleCode).queryKey,
      });
    },
  });
}

export function useDeleteRolePermission() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('rolePermission');

  return useAppMutation({
    mutationFn: ({ id, roleCode: _roleCode }: { id: number; roleCode: string }) =>
      rolePermissionApi.remove(id),
    onSuccess: (_data, variables) => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: rolePermissionQueries.byRole(variables.roleCode).queryKey,
      });
    },
  });
}
