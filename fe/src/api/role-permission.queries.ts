import { queryOptions } from '@tanstack/react-query';
import { rolePermissionApi } from '~/api/role-permission';

export const rolePermissionQueries = {
  all: (params?: { roleCode?: string; featureCode?: string }) =>
    queryOptions({
      queryKey: ['role-permissions', params],
      queryFn: () => rolePermissionApi.list(params),
    }),
  byRole: (roleCode: string) =>
    queryOptions({
      queryKey: ['role-permissions', 'role', roleCode],
      queryFn: () => rolePermissionApi.getByRoleCode(roleCode),
      enabled: !!roleCode,
    }),
};
