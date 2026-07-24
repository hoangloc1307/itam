import { ENDPOINTS } from 'itam-shared/constants';
import type { ChangePasswordInput, LoginInput, RegisterInput } from 'itam-shared/schemas/auth';
import type { ApiResponse, LoginResponse, ProfileResponse } from 'itam-shared/types';
import api from '~/lib/axios';

const login = async (payload: LoginInput): Promise<ApiResponse<LoginResponse>> =>
  await api.post<ApiResponse<LoginResponse>>(`${ENDPOINTS.AUTH}/login`, payload);

const register = async (payload: RegisterInput): Promise<ApiResponse<null>> =>
  await api.post<ApiResponse<null>>(`${ENDPOINTS.AUTH}/register`, payload);

const getProfile = async (): Promise<ApiResponse<ProfileResponse>> =>
  await api.get<ApiResponse<ProfileResponse>>(`${ENDPOINTS.AUTH}/profile`);

const changePassword = async (payload: ChangePasswordInput): Promise<ApiResponse<null>> =>
  await api.put<ApiResponse<null>>(`${ENDPOINTS.AUTH}/change-password`, payload);

export const authApi = { login, register, getProfile, changePassword };
