import { useQueryClient } from '@tanstack/react-query';
import type { SyncModelAttributeValuePayload } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { modelAttributeValueApi } from '~/api/model-attribute-value';
import { modelAttributeValueQueries } from '~/api/model-attribute-value.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useSyncModelAttributeValues() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('model');

  return useAppMutation({
    mutationFn: ({
      modelId,
      values,
    }: {
      modelId: string;
      values: SyncModelAttributeValuePayload[];
    }) => modelAttributeValueApi.sync(modelId, values),
    onSuccess: (_data, variables) => {
      toast.success(t('attributeValues.syncSuccess'));
      queryClient.invalidateQueries({
        queryKey: modelAttributeValueQueries.byModelId(variables.modelId).queryKey,
      });
    },
  });
}
