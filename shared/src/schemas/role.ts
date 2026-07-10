import { z } from 'zod';

export const createRoleSchema = z.object({
  code: z
    .string()
    .nonempty('role:validation.codeRequired')
    .max(50, 'role:validation.codeMaxLength'),
  name: z
    .string()
    .nonempty('role:validation.nameRequired')
    .max(100, 'role:validation.nameMaxLength'),
  isActive: z.boolean(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = createRoleSchema.omit({ code: true }).partial();

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
