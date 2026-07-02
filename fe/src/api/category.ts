import type { CreateCategoryInput, UpdateCategoryInput } from 'itam-shared/schemas/category';
import api from '~/lib/axios';
import type { ApiResponse } from '~/types/api';

export interface Category {
  id: string;
  name: string;
  serialKey: string;
  maintenanceIntervalHours: number | null;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
}

const ENDPOINT = '/categories';

const list = async (params?: { page?: number; limit?: number; search?: string }) =>
  await api.get<ApiResponse<Category[]>>(ENDPOINT, params);

const getById = async (id: string) => await api.get<ApiResponse<Category>>(`${ENDPOINT}/${id}`);

const create = async (payload: CreateCategoryInput) =>
  await api.post<ApiResponse<Category>>(ENDPOINT, payload);

const update = async (id: string, payload: UpdateCategoryInput) =>
  await api.put<ApiResponse<Category>>(`${ENDPOINT}/${id}`, payload);

const remove = async (id: string) => await api.delete<ApiResponse<null>>(`${ENDPOINT}/${id}`);

export const categoryApi = { list, getById, create, update, remove };
