import { ENDPOINTS } from 'itam-shared/constants';
import type { ApiResponse, CategoryAttributeItem, SyncAttributePayload } from 'itam-shared/types';
import api from '~/lib/axios';

const getByCategoryId = async (categoryId: string) =>
  await api.get<ApiResponse<CategoryAttributeItem[]>>(
    `${ENDPOINTS.CATEGORY_ATTRIBUTES}/${categoryId}`,
  );

const sync = async (categoryId: string, attributes: SyncAttributePayload[]) =>
  await api.put<ApiResponse<CategoryAttributeItem[]>>(
    `${ENDPOINTS.CATEGORY_ATTRIBUTES}/${categoryId}`,
    { attributes },
  );

export const categoryAttributeApi = { getByCategoryId, sync };
