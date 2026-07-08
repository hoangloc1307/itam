import { ENDPOINTS } from 'itam-shared/constants';
import type { CreateCategoryInput, UpdateCategoryInput } from 'itam-shared/schemas/category';
import type { ApiResponse, Category } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: { page?: number; limit?: number; search?: string }) =>
  await api.get<ApiResponse<Category[]>>(ENDPOINTS.CATEGORIES, params);

const getById = async (id: string) =>
  await api.get<ApiResponse<Category>>(`${ENDPOINTS.CATEGORIES}/${id}`);

const create = async (payload: CreateCategoryInput) =>
  await api.post<ApiResponse<Category>>(ENDPOINTS.CATEGORIES, payload);

const update = async (id: string, payload: UpdateCategoryInput) =>
  await api.put<ApiResponse<Category>>(`${ENDPOINTS.CATEGORIES}/${id}`, payload);

const remove = async (id: string) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.CATEGORIES}/${id}`);

export const categoryApi = { list, getById, create, update, remove };
