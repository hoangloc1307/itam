import { ENDPOINTS } from 'itam-shared/constants';
import type {
  ApiResponse,
  ModelAttributeValueItem,
  SyncModelAttributeValuePayload,
} from 'itam-shared/types';
import api from '~/lib/axios';

const getByModelId = async (modelId: string) =>
  await api.get<ApiResponse<ModelAttributeValueItem[]>>(
    `${ENDPOINTS.MODEL_ATTRIBUTE_VALUES}/${modelId}`,
  );

const sync = async (modelId: string, values: SyncModelAttributeValuePayload[]) =>
  await api.put<ApiResponse<ModelAttributeValueItem[]>>(
    `${ENDPOINTS.MODEL_ATTRIBUTE_VALUES}/${modelId}`,
    { values },
  );

export const modelAttributeValueApi = { getByModelId, sync };
