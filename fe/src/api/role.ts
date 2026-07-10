import { ENDPOINTS } from 'itam-shared/constants';
import type { CreateRoleInput, UpdateRoleInput } from 'itam-shared/schemas/role';
import type { ApiResponse, Role } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: { page?: number; limit?: number; search?: string }) =>
  await api.get<ApiResponse<Role[]>>(ENDPOINTS.ROLES, params);

const getByCode = async (code: string) =>
  await api.get<ApiResponse<Role>>(`${ENDPOINTS.ROLES}/${code}`);

const create = async (payload: CreateRoleInput) =>
  await api.post<ApiResponse<Role>>(ENDPOINTS.ROLES, payload);

const update = async (code: string, payload: UpdateRoleInput) =>
  await api.put<ApiResponse<Role>>(`${ENDPOINTS.ROLES}/${code}`, payload);

const remove = async (code: string) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.ROLES}/${code}`);

export const roleApi = { list, getByCode, create, update, remove };
