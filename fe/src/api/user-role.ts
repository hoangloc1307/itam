import { ENDPOINTS } from 'itam-shared/constants';
import type {
  CreateUserRoleInput,
  SyncUserRolesInput,
  UpdateUserRoleInput,
} from 'itam-shared/schemas/user-role';
import type { ApiResponse, UserRole } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: {
  page?: number;
  limit?: number;
  username?: string;
  roleCode?: string;
}) => await api.get<ApiResponse<UserRole[]>>(ENDPOINTS.USER_ROLES, params);

const getByUsername = async (username: string) =>
  await api.get<ApiResponse<{ user: { username: string; name: string }; roles: UserRole[] }>>(
    `${ENDPOINTS.USER_ROLES}/${username}`,
  );

const create = async (payload: CreateUserRoleInput) =>
  await api.post<ApiResponse<UserRole>>(ENDPOINTS.USER_ROLES, payload);

const sync = async (payload: SyncUserRolesInput) =>
  await api.put<ApiResponse<UserRole[]>>(`${ENDPOINTS.USER_ROLES}/sync`, payload);

const update = async (id: number, payload: UpdateUserRoleInput) =>
  await api.put<ApiResponse<UserRole>>(`${ENDPOINTS.USER_ROLES}/${id}`, payload);

const remove = async (id: number) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.USER_ROLES}/${id}`);

export const userRoleApi = { list, getByUsername, create, update, sync, remove };
