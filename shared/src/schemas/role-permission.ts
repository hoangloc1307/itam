import { z } from 'zod';

export const createRolePermissionSchema = z.object({
  roleCode: z
    .string()
    .nonempty('rolePermission:validation.roleCodeRequired')
    .max(50, 'rolePermission:validation.roleCodeMaxLength'),
  featureCode: z
    .string()
    .nonempty('rolePermission:validation.featureCodeRequired')
    .max(100, 'rolePermission:validation.featureCodeMaxLength'),
  action: z.string().nonempty('rolePermission:validation.actionRequired'),
  section: z
    .string()
    .max(4, 'rolePermission:validation.sectionMaxLength')
    .nullable()
    .transform((val) => val || null),
});

export type CreateRolePermissionInput = z.infer<typeof createRolePermissionSchema>;

export const syncRolePermissionsSchema = z.object({
  roleCode: z
    .string()
    .nonempty('rolePermission:validation.roleCodeRequired')
    .max(50, 'rolePermission:validation.roleCodeMaxLength'),
  permissions: z.array(
    z.object({
      featureCode: z
        .string()
        .nonempty('rolePermission:validation.featureCodeRequired')
        .max(100, 'rolePermission:validation.featureCodeMaxLength'),
      action: z.string().nonempty('rolePermission:validation.actionRequired'),
      section: z
        .string()
        .max(4, 'rolePermission:validation.sectionMaxLength')
        .nullable()
        .transform((val) => val || null),
    }),
  ),
});

export type SyncRolePermissionsInput = z.infer<typeof syncRolePermissionsSchema>;

export const updateRolePermissionSchema = z.object({
  featureCode: z
    .string()
    .nonempty('rolePermission:validation.featureCodeRequired')
    .max(100, 'rolePermission:validation.featureCodeMaxLength'),
  action: z.string().nonempty('rolePermission:validation.actionRequired'),
  section: z
    .string()
    .max(4, 'rolePermission:validation.sectionMaxLength')
    .nullable()
    .transform((val) => val || null),
});

export type UpdateRolePermissionInput = z.infer<typeof updateRolePermissionSchema>;
