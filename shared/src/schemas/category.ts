import { z } from 'zod';

export const createCategorySchema = z.object({
  id: z
    .string()
    .nonempty('category:validation.idRequired')
    .max(30, 'category:validation.idMaxLength'),
  name: z
    .string()
    .nonempty('category:validation.nameRequired')
    .max(150, 'category:validation.nameMaxLength'),
  serialKey: z
    .string()
    .nonempty('category:validation.serialKeyRequired')
    .max(30, 'category:validation.serialKeyMaxLength'),
  maintenanceIntervalHours: z.number().int().positive().nullable(),
  isActive: z.boolean(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.omit({ id: true }).partial();

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
