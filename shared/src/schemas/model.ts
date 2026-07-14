import { z } from 'zod';

export const createModelSchema = z.object({
  id: z.string().nonempty('model:validation.idRequired').max(30, 'model:validation.idMaxLength'),
  categoryId: z.string().nonempty('model:validation.categoryIdRequired'),
  manufacturer: z
    .string()
    .max(150)
    .transform((val) => val || null),
  name: z
    .string()
    .nonempty('model:validation.nameRequired')
    .max(150, 'model:validation.nameMaxLength'),
  manageType: z.string().transform((val) => val || null),
  modelCode: z
    .string()
    .max(50)
    .transform((val) => val || null),
  isActive: z.boolean(),
});

export type CreateModelInput = z.input<typeof createModelSchema>;

export const updateModelSchema = createModelSchema.omit({ id: true }).partial();

export type UpdateModelInput = z.input<typeof updateModelSchema>;
