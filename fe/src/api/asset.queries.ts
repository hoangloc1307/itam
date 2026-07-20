import { queryOptions } from '@tanstack/react-query';
import { assetApi } from '~/api/asset';

export const assetQueries = {
  all: () =>
    queryOptions({
      queryKey: ['assets'],
      queryFn: () => assetApi.list(),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['assets', id],
      queryFn: () => assetApi.getById(id),
    }),
};
