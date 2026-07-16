import { queryOptions } from '@tanstack/react-query';
import { attributeGroupApi } from '~/api/attribute-group';

export const attributeGroupQueries = {
  all: () =>
    queryOptions({
      queryKey: ['attribute-groups'],
      queryFn: () => attributeGroupApi.list(),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: ['attribute-groups', id],
      queryFn: () => attributeGroupApi.getById(id),
    }),
};
