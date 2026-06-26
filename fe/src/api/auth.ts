import type { LoginInput, RegisterInput } from 'itam-shared/schemas/auth';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
}

// TODO: Khi có backend thật, thay bằng:
// import api from '~/lib/axios';
// login: (payload: LoginInput) => api.post<LoginResponse>('/auth/login', payload).then(r => r.data),

function delay(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authApi = {
  login: async (payload: LoginInput): Promise<LoginResponse> => {
    await delay(1500);

    if (payload.username === '12314092' && payload.password === '123456') {
      return {
        token: 'fake-jwt-token-abc123',
        user: {
          id: '1',
          username: '12314092',
          name: 'Trần Nguyễn Hoàng Lộc',
          email: 'hoangloc1307@gmail.com',
        },
      };
    }

    throw { response: { status: 401, data: { message: 'auth:validation.invalidCredentials' } } };
  },

  register: async (payload: RegisterInput): Promise<RegisterResponse> => {
    await delay(1500);

    if (payload.username === '00000001') {
      throw { response: { status: 409, data: { message: 'auth:validation.usernameExists' } } };
    }

    return { message: 'Đăng ký thành công' };
  },

  me: async (): Promise<User> => {
    await delay(500);

    return {
      id: '1',
      username: '00000001',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@vnn.vn',
    };
  },
};
