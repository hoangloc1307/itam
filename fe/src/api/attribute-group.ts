import { ENDPOINTS } from 'itam-shared/constants';
import type {
  CreateAttributeGroupInput,
  UpdateAttributeGroupInput,
} from 'itam-shared/schemas/attribute-group';
import type { ApiResponse, AttributeGroup } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: { page?: number; limit?: number; search?: string }) =>
  await api.get<ApiResponse<AttributeGroup[]>>(ENDPOINTS.ATTRIBUTE_GROUPS, params);

const getById = async (id: number) =>
  await api.get<ApiResponse<AttributeGroup>>(`${ENDPOINTS.ATTRIBUTE_GROUPS}/${id}`);

const create = async (payload: CreateAttributeGroupInput) =>
  await api.post<ApiResponse<AttributeGroup>>(ENDPOINTS.ATTRIBUTE_GROUPS, payload);

const update = async (id: number, payload: UpdateAttributeGroupInput) =>
  await api.put<ApiResponse<AttributeGroup>>(`${ENDPOINTS.ATTRIBUTE_GROUPS}/${id}`, payload);

const remove = async (id: number) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.ATTRIBUTE_GROUPS}/${id}`);

export const attributeGroupApi = { list, getById, create, update, remove };
