import { ENDPOINTS } from 'itam-shared/constants';
import type {
  CreateRolePermissionInput,
  SyncRolePermissionsInput,
  UpdateRolePermissionInput,
} from 'itam-shared/schemas/role-permission';
import type { ApiResponse, RolePermission } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: {
  page?: number;
  limit?: number;
  roleCode?: string;
  featureCode?: string;
}) => await api.get<ApiResponse<RolePermission[]>>(ENDPOINTS.ROLE_PERMISSIONS, params);

const getByRoleCode = async (roleCode: string) =>
  await api.get<
    ApiResponse<{ role: { code: string; name: string }; permissions: RolePermission[] }>
  >(`${ENDPOINTS.ROLE_PERMISSIONS}/${roleCode}`);

const create = async (payload: CreateRolePermissionInput) =>
  await api.post<ApiResponse<RolePermission>>(ENDPOINTS.ROLE_PERMISSIONS, payload);

const sync = async (payload: SyncRolePermissionsInput) =>
  await api.put<ApiResponse<RolePermission[]>>(`${ENDPOINTS.ROLE_PERMISSIONS}/sync`, payload);

const update = async (id: number, payload: UpdateRolePermissionInput) =>
  await api.put<ApiResponse<RolePermission>>(`${ENDPOINTS.ROLE_PERMISSIONS}/${id}`, payload);

const remove = async (id: number) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.ROLE_PERMISSIONS}/${id}`);

export const rolePermissionApi = { list, getByRoleCode, create, update, sync, remove };
