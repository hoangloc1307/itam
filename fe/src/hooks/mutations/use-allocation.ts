import { useQueryClient } from '@tanstack/react-query';
import type { CreateAllocationInput, ReturnAllocationInput } from 'itam-shared/schemas/allocation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { allocationApi } from '~/api/allocation';
import { allocationQueries } from '~/api/allocation.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateAllocation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('allocation');

  return useAppMutation({
    mutationFn: (payload: CreateAllocationInput) => allocationApi.create(payload),
    onSuccess: () => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: allocationQueries.all().queryKey });
    },
  });
}

export function useReturnAllocation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('allocation');

  return useAppMutation({
    mutationFn: ({ id, ...payload }: ReturnAllocationInput & { id: number }) =>
      allocationApi.returnAllocation(id, payload),
    onSuccess: () => {
      toast.success(t('returnSuccess'));
      queryClient.invalidateQueries({ queryKey: allocationQueries.all().queryKey });
    },
  });
}

export function useDeleteAllocation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('allocation');

  return useAppMutation({
    mutationFn: (id: number) => allocationApi.remove(id),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: allocationQueries.all().queryKey });
    },
  });
}
