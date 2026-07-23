import { z } from 'zod';

export const createAllocationSchema = z.object({
  assetId: z
    .string()
    .nonempty('allocation:validation.assetIdRequired')
    .max(50, 'allocation:validation.assetIdMaxLength'),
  assetCode: z.string().max(50).nullable().optional(),
  employeeId: z.string().max(8, 'allocation:validation.employeeIdMaxLength').nullable(),
  sectionId: z.string().max(4, 'allocation:validation.sectionIdMaxLength').nullable(),
  quantity: z.number().int().positive('allocation:validation.quantityPositive').default(1),
  assignedDate: z.string().optional(),
  requestNo: z.string().max(50).nullable().optional(),
  note: z.string().nullable().optional(),
});

export type CreateAllocationInput = z.infer<typeof createAllocationSchema>;

export const returnAllocationSchema = z.object({
  note: z.string().nullable().optional(),
});

export type ReturnAllocationInput = z.infer<typeof returnAllocationSchema>;
