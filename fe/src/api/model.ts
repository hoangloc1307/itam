import { ENDPOINTS } from 'itam-shared/constants';
import type { CreateModelInput, UpdateModelInput } from 'itam-shared/schemas/model';
import type { ApiResponse, Model } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}) => await api.get<ApiResponse<Model[]>>(ENDPOINTS.MODELS, params);

const getById = async (id: string) =>
  await api.get<ApiResponse<Model>>(`${ENDPOINTS.MODELS}/${id}`);

const create = async (payload: CreateModelInput) =>
  await api.post<ApiResponse<Model>>(ENDPOINTS.MODELS, payload);

const update = async (id: string, payload: UpdateModelInput) =>
  await api.put<ApiResponse<Model>>(`${ENDPOINTS.MODELS}/${id}`, payload);

const remove = async (id: string) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.MODELS}/${id}`);

export const modelApi = { list, getById, create, update, remove };
