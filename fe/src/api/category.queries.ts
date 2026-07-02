import { queryOptions } from '@tanstack/react-query';
import { categoryApi } from '~/api/category';

export const categoryQueries = {
  all: () =>
    queryOptions({
      queryKey: ['categories'],
      queryFn: () => categoryApi.list(),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['categories', id],
      queryFn: () => categoryApi.getById(id),
    }),
};
