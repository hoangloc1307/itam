import { ENDPOINTS } from 'itam-shared/constants';
import type {
  CreateUserPermissionInput,
  SyncUserPermissionsInput,
  UpdateUserPermissionInput,
} from 'itam-shared/schemas/user-permission';
import type { ApiResponse, UserPermission } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: {
  page?: number;
  limit?: number;
  username?: string;
  featureCode?: string;
}) => await api.get<ApiResponse<UserPermission[]>>(ENDPOINTS.USER_PERMISSIONS, params);

const getByUsername = async (username: string) =>
  await api.get<
    ApiResponse<{ user: { username: string; name: string }; permissions: UserPermission[] }>
  >(`${ENDPOINTS.USER_PERMISSIONS}/${username}`);

const create = async (payload: CreateUserPermissionInput) =>
  await api.post<ApiResponse<UserPermission>>(ENDPOINTS.USER_PERMISSIONS, payload);

const sync = async (payload: SyncUserPermissionsInput) =>
  await api.put<ApiResponse<UserPermission[]>>(`${ENDPOINTS.USER_PERMISSIONS}/sync`, payload);

const update = async (id: number, payload: UpdateUserPermissionInput) =>
  await api.put<ApiResponse<UserPermission>>(`${ENDPOINTS.USER_PERMISSIONS}/${id}`, payload);

const remove = async (id: number) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.USER_PERMISSIONS}/${id}`);

export const userPermissionApi = { list, getByUsername, create, update, sync, remove };
