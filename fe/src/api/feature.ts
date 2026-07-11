import { ENDPOINTS } from 'itam-shared/constants';
import type { CreateFeatureInput, UpdateFeatureInput } from 'itam-shared/schemas/feature';
import type { ApiResponse, Feature } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: { page?: number; limit?: number; search?: string }) =>
  await api.get<ApiResponse<Feature[]>>(ENDPOINTS.FEATURES, params);

const getByCode = async (code: string) =>
  await api.get<ApiResponse<Feature>>(`${ENDPOINTS.FEATURES}/${code}`);

const create = async (payload: CreateFeatureInput) =>
  await api.post<ApiResponse<Feature>>(ENDPOINTS.FEATURES, payload);

const update = async (code: string, payload: UpdateFeatureInput) =>
  await api.put<ApiResponse<Feature>>(`${ENDPOINTS.FEATURES}/${code}`, payload);

const remove = async (code: string) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.FEATURES}/${code}`);

export const featureApi = { list, getByCode, create, update, remove };
