import { queryOptions } from '@tanstack/react-query';
import { userApi } from '~/api/user';

export const userQueries = {
  all: () =>
    queryOptions({
      queryKey: ['users'],
      queryFn: () => userApi.list(),
    }),
  detail: (username: string) =>
    queryOptions({
      queryKey: ['users', username],
      queryFn: () => userApi.getById(username),
    }),
};
