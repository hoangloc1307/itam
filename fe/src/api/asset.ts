import { ENDPOINTS } from 'itam-shared/constants';
import type {
  CreateAssetInput,
  CreateBatchAssetInput,
  UpdateAssetInput,
} from 'itam-shared/schemas/asset';
import type { ApiResponse, Asset, AssetDetail } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: { search?: string }) =>
  await api.get<ApiResponse<Asset[]>>(ENDPOINTS.ASSETS, params);

const getById = async (id: string) =>
  await api.get<ApiResponse<AssetDetail>>(`${ENDPOINTS.ASSETS}/${id}`);

const create = async (payload: CreateAssetInput) =>
  await api.post<ApiResponse<Asset>>(ENDPOINTS.ASSETS, payload);

const createBatch = async (payload: CreateBatchAssetInput) =>
  await api.post<ApiResponse<{ count: number }>>(`${ENDPOINTS.ASSETS}/batch`, payload);

const update = async (id: string, payload: UpdateAssetInput) =>
  await api.put<ApiResponse<Asset>>(`${ENDPOINTS.ASSETS}/${id}`, payload);

const remove = async (id: string) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.ASSETS}/${id}`);

export const assetApi = { list, getById, create, createBatch, update, remove };
