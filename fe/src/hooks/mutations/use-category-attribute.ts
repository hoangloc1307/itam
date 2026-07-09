import { useQueryClient } from '@tanstack/react-query';
import type { SyncAttributePayload } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { categoryAttributeApi } from '~/api/category-attribute';
import { categoryAttributeQueries } from '~/api/category-attribute.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useSyncCategoryAttributes() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('categoryAttribute');

  return useAppMutation({
    mutationFn: ({
      categoryId,
      attributes,
    }: {
      categoryId: string;
      attributes: SyncAttributePayload[];
    }) => categoryAttributeApi.sync(categoryId, attributes),
    onSuccess: (_data, variables) => {
      toast.success(t('syncSuccess'));
      queryClient.invalidateQueries({
        queryKey: categoryAttributeQueries.byCategory(variables.categoryId).queryKey,
      });
    },
  });
}
