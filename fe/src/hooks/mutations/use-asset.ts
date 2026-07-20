import { useQueryClient } from '@tanstack/react-query';
import type {
  CreateAssetInput,
  CreateBatchAssetInput,
  UpdateAssetInput,
} from 'itam-shared/schemas/asset';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { assetApi } from '~/api/asset';
import { assetQueries } from '~/api/asset.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateAsset() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('asset');

  return useAppMutation({
    mutationFn: (payload: CreateAssetInput) => assetApi.create(payload),
    onSuccess: () => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: assetQueries.all().queryKey });
    },
  });
}

export function useCreateBatchAsset() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('asset');

  return useAppMutation({
    mutationFn: (payload: CreateBatchAssetInput) => assetApi.createBatch(payload),
    onSuccess: (data) => {
      const count = data?.data?.count ?? 0;
      toast.success(t('batchCreateSuccess', { count }));
      queryClient.invalidateQueries({ queryKey: assetQueries.all().queryKey });
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('asset');

  return useAppMutation({
    mutationFn: ({ id, ...payload }: UpdateAssetInput & { id: string }) =>
      assetApi.update(id, payload),
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({ queryKey: assetQueries.all().queryKey });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('asset');

  return useAppMutation({
    mutationFn: (id: string) => assetApi.remove(id),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: assetQueries.all().queryKey });
    },
  });
}
