import { queryOptions } from '@tanstack/react-query';
import { roleApi } from '~/api/role';

export const roleQueries = {
  all: () =>
    queryOptions({
      queryKey: ['roles'],
      queryFn: () => roleApi.list(),
    }),
  detail: (code: string) =>
    queryOptions({
      queryKey: ['roles', code],
      queryFn: () => roleApi.getByCode(code),
    }),
};
