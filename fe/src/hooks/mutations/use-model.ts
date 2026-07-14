import { useQueryClient } from '@tanstack/react-query';
import type { CreateModelInput, UpdateModelInput } from 'itam-shared/schemas/model';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { modelApi } from '~/api/model';
import { modelQueries } from '~/api/model.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateModel() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('model');

  return useAppMutation({
    mutationFn: (payload: CreateModelInput) => modelApi.create(payload),
    onSuccess: () => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: modelQueries.all().queryKey });
    },
  });
}

export function useUpdateModel() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('model');

  return useAppMutation({
    mutationFn: ({ id, ...payload }: UpdateModelInput & { id: string }) =>
      modelApi.update(id, payload),
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({ queryKey: modelQueries.all().queryKey });
    },
  });
}

export function useDeleteModel() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('model');

  return useAppMutation({
    mutationFn: (id: string) => modelApi.remove(id),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: modelQueries.all().queryKey });
    },
  });
}
