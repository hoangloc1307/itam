import { z } from 'zod';

export const createUserPermissionSchema = z.object({
  username: z
    .string()
    .nonempty('userPermission:validation.usernameRequired')
    .max(8, 'userPermission:validation.usernameMaxLength'),
  featureCode: z
    .string()
    .nonempty('userPermission:validation.featureCodeRequired')
    .max(100, 'userPermission:validation.featureCodeMaxLength'),
  action: z.string().nonempty('userPermission:validation.actionRequired'),
  decision: z.enum(['ALLOW', 'DENY'], {
    required_error: 'userPermission:validation.decisionRequired',
  }),
  section: z
    .string()
    .max(4, 'userPermission:validation.sectionMaxLength')
    .nullable()
    .transform((val) => val || null),
});

export type CreateUserPermissionInput = z.infer<typeof createUserPermissionSchema>;

export const syncUserPermissionsSchema = z.object({
  username: z
    .string()
    .nonempty('userPermission:validation.usernameRequired')
    .max(8, 'userPermission:validation.usernameMaxLength'),
  permissions: z.array(
    z.object({
      featureCode: z
        .string()
        .nonempty('userPermission:validation.featureCodeRequired')
        .max(100, 'userPermission:validation.featureCodeMaxLength'),
      action: z.string().nonempty('userPermission:validation.actionRequired'),
      decision: z.enum(['ALLOW', 'DENY'], {
        required_error: 'userPermission:validation.decisionRequired',
      }),
      section: z
        .string()
        .max(4, 'userPermission:validation.sectionMaxLength')
        .nullable()
        .transform((val) => val || null),
    }),
  ),
});

export type SyncUserPermissionsInput = z.infer<typeof syncUserPermissionsSchema>;

export const updateUserPermissionSchema = z.object({
  featureCode: z
    .string()
    .nonempty('userPermission:validation.featureCodeRequired')
    .max(100, 'userPermission:validation.featureCodeMaxLength'),
  action: z.string().nonempty('userPermission:validation.actionRequired'),
  decision: z.enum(['ALLOW', 'DENY'], {
    required_error: 'userPermission:validation.decisionRequired',
  }),
  section: z
    .string()
    .max(4, 'userPermission:validation.sectionMaxLength')
    .nullable()
    .transform((val) => val || null),
});

export type UpdateUserPermissionInput = z.infer<typeof updateUserPermissionSchema>;
