import { useQueryClient } from '@tanstack/react-query';
import type {
  CreateDocumentSequenceInput,
  UpdateDocumentSequenceInput,
} from 'itam-shared/schemas/document-sequence';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { documentSequenceApi } from '~/api/document-sequence';
import { documentSequenceQueries } from '~/api/document-sequence.queries';
import { useAppMutation } from '~/hooks/use-app-mutation';

export function useCreateDocumentSequence() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('documentSequence');

  return useAppMutation({
    mutationFn: (payload: CreateDocumentSequenceInput) => documentSequenceApi.create(payload),
    onSuccess: () => {
      toast.success(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: documentSequenceQueries.all().queryKey });
    },
  });
}

export function useUpdateDocumentSequence() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('documentSequence');

  return useAppMutation({
    mutationFn: ({ id, ...payload }: UpdateDocumentSequenceInput & { id: number }) =>
      documentSequenceApi.update(id, payload as UpdateDocumentSequenceInput),
    onSuccess: () => {
      toast.success(t('updateSuccess'));
      queryClient.invalidateQueries({ queryKey: documentSequenceQueries.all().queryKey });
    },
  });
}

export function useDeleteDocumentSequence() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('documentSequence');

  return useAppMutation({
    mutationFn: (id: number) => documentSequenceApi.remove(id),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: documentSequenceQueries.all().queryKey });
    },
  });
}
