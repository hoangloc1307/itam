import { queryOptions } from '@tanstack/react-query';
import type { AllocationListParams } from '~/api/allocation';
import { allocationApi } from '~/api/allocation';

export const allocationQueries = {
  all: (params?: AllocationListParams) =>
    queryOptions({
      queryKey: ['allocations', params],
      queryFn: () => allocationApi.list(params),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: ['allocations', id],
      queryFn: () => allocationApi.getById(id),
      enabled: id > 0,
    }),
};
