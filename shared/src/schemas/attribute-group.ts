import { z } from 'zod';

export const createAttributeGroupSchema = z.object({
  name: z
    .string()
    .nonempty('attributeGroup:validation.nameRequired')
    .max(150, 'attributeGroup:validation.nameMaxLength'),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

export type CreateAttributeGroupInput = z.infer<typeof createAttributeGroupSchema>;

export const updateAttributeGroupSchema = createAttributeGroupSchema.partial();

export type UpdateAttributeGroupInput = z.infer<typeof updateAttributeGroupSchema>;
