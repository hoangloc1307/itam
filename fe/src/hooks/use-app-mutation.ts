import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { ApiResponse } from '~/types/api';

export function useAppMutation<TData, TVariables>(
  options: UseMutationOptions<TData, AxiosError<ApiResponse<unknown>>, TVariables>,
) {
  return useMutation({
    ...options,
    onError: (error, variables, onMutateResult, context) => {
      toast.error(error.response?.data?.message ?? error.message ?? 'Something went wrong', {
        description: 'CODE: ' + (error.response?.data?.errorCode ?? 'UNKNOWN'),
      });

      options.onError?.(error, variables, onMutateResult, context);
    },
  });
}
