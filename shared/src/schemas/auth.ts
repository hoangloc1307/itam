import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .nonempty('auth:validation.usernameRequired')
    .length(8, 'auth:validation.usernameLength'),
  password: z.string().min(6, 'auth:validation.passwordMin'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string()
    .nonempty('auth:validation.usernameRequired')
    .length(8, 'auth:validation.usernameLength'),
  email: z.email('auth:validation.emailInvalid'),
  name: z.string().nonempty('auth:validation.nameRequired'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'auth:validation.passwordMin'),
    newPassword: z.string().min(6, 'auth:validation.passwordMin'),
    confirmPassword: z.string().min(6, 'auth:validation.passwordMin'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'auth:validation.confirmPasswordMismatch',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
