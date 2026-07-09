import { queryOptions } from '@tanstack/react-query';
import { categoryAttributeApi } from '~/api/category-attribute';

export const categoryAttributeQueries = {
  byCategory: (categoryId: string) =>
    queryOptions({
      queryKey: ['category-attributes', categoryId],
      queryFn: () => categoryAttributeApi.getByCategoryId(categoryId),
      enabled: !!categoryId,
    }),
};
