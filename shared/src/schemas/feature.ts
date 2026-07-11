import { z } from 'zod';

export const createFeatureSchema = z.object({
  code: z
    .string()
    .nonempty('feature:validation.codeRequired')
    .max(100, 'feature:validation.codeMaxLength'),
  name: z
    .string()
    .nonempty('feature:validation.nameRequired')
    .max(150, 'feature:validation.nameMaxLength'),
  isActive: z.boolean(),
});

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;

export const updateFeatureSchema = createFeatureSchema.omit({ code: true }).partial();

export type UpdateFeatureInput = z.infer<typeof updateFeatureSchema>;
