import { queryOptions } from '@tanstack/react-query';
import { modelApi } from '~/api/model';

export const modelQueries = {
  all: (categoryId?: string) =>
    queryOptions({
      queryKey: ['models', { categoryId }],
      queryFn: () => modelApi.list({ categoryId }),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['models', id],
      queryFn: () => modelApi.getById(id),
    }),
};
