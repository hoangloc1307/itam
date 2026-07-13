import { queryOptions } from '@tanstack/react-query';
import { userRoleApi } from '~/api/user-role';

export const userRoleQueries = {
  all: (params?: { username?: string; roleCode?: string }) =>
    queryOptions({
      queryKey: ['user-roles', params],
      queryFn: () => userRoleApi.list(params),
    }),
  byUser: (username: string) =>
    queryOptions({
      queryKey: ['user-roles', 'user', username],
      queryFn: () => userRoleApi.getByUsername(username),
      enabled: !!username,
    }),
};
