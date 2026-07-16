import { useQueryClient } from '@tanstack/react-query';
import type {
  CreateAttributeGroupInput,
  UpdateAttributeGroupInput,
} from 'itam-shared/schemas/attribute-group';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { attributeGroupApi } from '~/api/attribute-group';
import { attributeGroupQueries } from '~/api/attribute-group.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateAttributeGroup() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('attributeGroup');

  return useAppMutation({
    mutationFn: (payload: CreateAttributeGroupInput) => attributeGroupApi.create(payload),
    onSuccess: () => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: attributeGroupQueries.all().queryKey });
    },
  });
}

export function useUpdateAttributeGroup() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('attributeGroup');

  return useAppMutation({
    mutationFn: ({ id, ...payload }: UpdateAttributeGroupInput & { id: number }) =>
      attributeGroupApi.update(id, payload),
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({ queryKey: attributeGroupQueries.all().queryKey });
    },
  });
}

export function useDeleteAttributeGroup() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('attributeGroup');

  return useAppMutation({
    mutationFn: (id: number) => attributeGroupApi.remove(id),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: attributeGroupQueries.all().queryKey });
    },
  });
}
