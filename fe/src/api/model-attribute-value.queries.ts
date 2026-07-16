import { queryOptions } from '@tanstack/react-query';
import { modelAttributeValueApi } from '~/api/model-attribute-value';

export const modelAttributeValueQueries = {
  byModelId: (modelId: string) =>
    queryOptions({
      queryKey: ['model-attribute-values', modelId],
      queryFn: () => modelAttributeValueApi.getByModelId(modelId),
      enabled: !!modelId,
    }),
};
