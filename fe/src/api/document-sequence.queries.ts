import { queryOptions } from '@tanstack/react-query';
import { documentSequenceApi } from '~/api/document-sequence';

export const documentSequenceQueries = {
  all: () =>
    queryOptions({
      queryKey: ['document-sequences'],
      queryFn: () => documentSequenceApi.list(),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: ['document-sequences', id],
      queryFn: () => documentSequenceApi.getById(id),
    }),
};
