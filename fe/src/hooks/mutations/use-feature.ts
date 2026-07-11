import { useQueryClient } from '@tanstack/react-query';
import type { CreateFeatureInput, UpdateFeatureInput } from 'itam-shared/schemas/feature';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { featureApi } from '~/api/feature';
import { featureQueries } from '~/api/feature.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateFeature() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('feature');

  return useAppMutation({
    mutationFn: (payload: CreateFeatureInput) => featureApi.create(payload),
    onSuccess: () => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: featureQueries.all().queryKey });
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('feature');

  return useAppMutation({
    mutationFn: ({ code, ...payload }: UpdateFeatureInput & { code: string }) =>
      featureApi.update(code, payload),
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({ queryKey: featureQueries.all().queryKey });
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('feature');

  return useAppMutation({
    mutationFn: (code: string) => featureApi.remove(code),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: featureQueries.all().queryKey });
    },
  });
}
