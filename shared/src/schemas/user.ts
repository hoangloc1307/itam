import { z } from 'zod';

export const createUserSchema = z.object({
  username: z
    .string()
    .nonempty('user:validation.usernameRequired')
    .length(8, 'user:validation.usernameLength'),
  email: z.email('user:validation.emailInvalid'),
  name: z
    .string()
    .nonempty('user:validation.nameRequired')
    .max(100, 'user:validation.nameMaxLength'),
  isActive: z.boolean(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  email: z.email('user:validation.emailInvalid').optional(),
  name: z
    .string()
    .nonempty('user:validation.nameRequired')
    .max(100, 'user:validation.nameMaxLength')
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
