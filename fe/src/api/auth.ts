import { ENDPOINTS } from 'itam-shared/constants';
import type { LoginInput, RegisterInput } from 'itam-shared/schemas/auth';
import type { ApiResponse, LoginResponse } from 'itam-shared/types';
import api from '~/lib/axios';

const login = async (payload: LoginInput): Promise<ApiResponse<LoginResponse>> =>
  await api.post<ApiResponse<LoginResponse>>(`${ENDPOINTS.AUTH}/login`, payload);

const register = async (payload: RegisterInput): Promise<ApiResponse<null>> =>
  await api.post<ApiResponse<null>>(`${ENDPOINTS.AUTH}/register`, payload);

export const authApi = { login, register };
