import type { LoginInput, RegisterInput } from 'itam-shared/schemas/auth';
import api from '~/lib/axios';
import type { ApiResponse } from '~/types/api';

interface User {
  username: string;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

const AUTH_ENDPOINT = '/auth';

const login = async (payload: LoginInput): Promise<ApiResponse<LoginResponse>> =>
  await api.post<ApiResponse<LoginResponse>>(`${AUTH_ENDPOINT}/login`, payload);

const register = async (payload: RegisterInput): Promise<ApiResponse<null>> =>
  await api.post<ApiResponse<null>>(`${AUTH_ENDPOINT}/register`, payload);

export const authApi = { login, register };
