import { queryOptions } from '@tanstack/react-query';
import { featureApi } from '~/api/feature';

export const featureQueries = {
  all: () =>
    queryOptions({
      queryKey: ['features'],
      queryFn: () => featureApi.list(),
    }),
  detail: (code: string) =>
    queryOptions({
      queryKey: ['features', code],
      queryFn: () => featureApi.getByCode(code),
    }),
};
