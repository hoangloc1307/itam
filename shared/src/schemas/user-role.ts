import { z } from 'zod';

export const createUserRoleSchema = z.object({
  username: z
    .string()
    .nonempty('userRole:validation.usernameRequired')
    .max(8, 'userRole:validation.usernameMaxLength'),
  roleCode: z
    .string()
    .nonempty('userRole:validation.roleCodeRequired')
    .max(50, 'userRole:validation.roleCodeMaxLength'),
  section: z
    .string()
    .max(4, 'userRole:validation.sectionMaxLength')
    .nullable()
    .transform((val) => val || null),
});

export type CreateUserRoleInput = z.infer<typeof createUserRoleSchema>;

export const syncUserRolesSchema = z.object({
  username: z
    .string()
    .nonempty('userRole:validation.usernameRequired')
    .max(8, 'userRole:validation.usernameMaxLength'),
  roles: z.array(
    z.object({
      roleCode: z
        .string()
        .nonempty('userRole:validation.roleCodeRequired')
        .max(50, 'userRole:validation.roleCodeMaxLength'),
      section: z
        .string()
        .max(4, 'userRole:validation.sectionMaxLength')
        .nullable()
        .transform((val) => val || null),
    }),
  ),
});

export type SyncUserRolesInput = z.infer<typeof syncUserRolesSchema>;

export const updateUserRoleSchema = z.object({
  roleCode: z
    .string()
    .nonempty('userRole:validation.roleCodeRequired')
    .max(50, 'userRole:validation.roleCodeMaxLength'),
  section: z
    .string()
    .max(4, 'userRole:validation.sectionMaxLength')
    .nullable()
    .transform((val) => val || null),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
