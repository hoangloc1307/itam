import { queryOptions } from '@tanstack/react-query';
import { userPermissionApi } from '~/api/user-permission';

export const userPermissionQueries = {
  all: (params?: { username?: string; featureCode?: string }) =>
    queryOptions({
      queryKey: ['user-permissions', params],
      queryFn: () => userPermissionApi.list(params),
    }),
  byUser: (username: string) =>
    queryOptions({
      queryKey: ['user-permissions', 'user', username],
      queryFn: () => userPermissionApi.getByUsername(username),
      enabled: !!username,
    }),
};
