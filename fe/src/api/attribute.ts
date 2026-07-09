import { ENDPOINTS } from 'itam-shared/constants';
import type { CreateAttributeInput, UpdateAttributeInput } from 'itam-shared/schemas/attribute';
import type { ApiResponse, Attribute } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: { page?: number; limit?: number; search?: string }) =>
  await api.get<ApiResponse<Attribute[]>>(ENDPOINTS.ATTRIBUTES, params);

const getById = async (id: number) =>
  await api.get<ApiResponse<Attribute>>(`${ENDPOINTS.ATTRIBUTES}/${id}`);

const create = async (payload: CreateAttributeInput) =>
  await api.post<ApiResponse<Attribute>>(ENDPOINTS.ATTRIBUTES, payload);

const update = async (id: number, payload: UpdateAttributeInput) =>
  await api.put<ApiResponse<Attribute>>(`${ENDPOINTS.ATTRIBUTES}/${id}`, payload);

const remove = async (id: number) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.ATTRIBUTES}/${id}`);

export const attributeApi = { list, getById, create, update, remove };
