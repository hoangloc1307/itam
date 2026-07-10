import { ENDPOINTS } from 'itam-shared/constants';
import type { CreateUserInput, UpdateUserInput } from 'itam-shared/schemas/user';
import type { ApiResponse, User } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: { page?: number; limit?: number; search?: string }) =>
  await api.get<ApiResponse<User[]>>(ENDPOINTS.USERS, params);

const getById = async (username: string) =>
  await api.get<ApiResponse<User>>(`${ENDPOINTS.USERS}/${username}`);

const create = async (payload: CreateUserInput) =>
  await api.post<ApiResponse<User>>(ENDPOINTS.USERS, payload);

const update = async (username: string, payload: UpdateUserInput) =>
  await api.put<ApiResponse<User>>(`${ENDPOINTS.USERS}/${username}`, payload);

const resetPassword = async (username: string) =>
  await api.post<ApiResponse<null>>(`${ENDPOINTS.USERS}/${username}/reset-password`);

const remove = async (username: string) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.USERS}/${username}`);

export const userApi = { list, getById, create, update, remove, resetPassword };
