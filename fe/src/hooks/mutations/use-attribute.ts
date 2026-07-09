import { useQueryClient } from '@tanstack/react-query';
import type { CreateAttributeInput, UpdateAttributeInput } from 'itam-shared/schemas/attribute';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { attributeApi } from '~/api/attribute';
import { attributeQueries } from '~/api/attribute.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateAttribute() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('attribute');

  return useAppMutation({
    mutationFn: (payload: CreateAttributeInput) => attributeApi.create(payload),
    onSuccess: () => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: attributeQueries.all().queryKey });
    },
  });
}

export function useUpdateAttribute() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('attribute');

  return useAppMutation({
    mutationFn: ({ id, ...payload }: UpdateAttributeInput & { id: number }) =>
      attributeApi.update(id, payload),
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({ queryKey: attributeQueries.all().queryKey });
    },
  });
}

export function useDeleteAttribute() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('attribute');

  return useAppMutation({
    mutationFn: (id: number) => attributeApi.remove(id),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: attributeQueries.all().queryKey });
    },
  });
}
