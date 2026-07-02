import { useQueryClient } from '@tanstack/react-query';
import type { CreateCategoryInput, UpdateCategoryInput } from 'itam-shared/schemas/category';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { categoryApi } from '~/api/category';
import { categoryQueries } from '~/api/category.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('category');

  return useAppMutation({
    mutationFn: (payload: CreateCategoryInput) => categoryApi.create(payload),
    onSuccess: () => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: categoryQueries.all().queryKey });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('category');

  return useAppMutation({
    mutationFn: ({ id, ...payload }: UpdateCategoryInput & { id: string }) =>
      categoryApi.update(id, payload),
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({ queryKey: categoryQueries.all().queryKey });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('category');

  return useAppMutation({
    mutationFn: (id: string) => categoryApi.remove(id),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: categoryQueries.all().queryKey });
    },
  });
}
