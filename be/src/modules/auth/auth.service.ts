import type { LoginInput, RegisterInput } from 'itam-shared/schemas/auth';

export const authService = {
  login: async (_payload: LoginInput) => {
    // TODO: implement login logic
    throw new Error('Not implemented');
  },

  register: async (_payload: RegisterInput) => {
    // TODO: implement register logic
    throw new Error('Not implemented');
  },

  refresh: async (_payload: { refreshToken: string }) => {
    // TODO: implement token refresh logic
    throw new Error('Not implemented');
  },
};
