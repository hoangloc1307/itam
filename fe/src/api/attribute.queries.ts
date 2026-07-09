import { queryOptions } from '@tanstack/react-query';
import { attributeApi } from '~/api/attribute';

export const attributeQueries = {
  all: () =>
    queryOptions({
      queryKey: ['attributes'],
      queryFn: () => attributeApi.list(),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: ['attributes', id],
      queryFn: () => attributeApi.getById(id),
    }),
};
