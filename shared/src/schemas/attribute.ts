import { z } from 'zod';

export const attributeDataTypes = ['TEXT', 'NUMBER', 'DATE', 'SELECT', 'BOOLEAN'] as const;
export type AttributeDataType = (typeof attributeDataTypes)[number];

export const createAttributeSchema = z.object({
  name: z
    .string()
    .nonempty('attribute:validation.nameRequired')
    .max(150, 'attribute:validation.nameMaxLength'),
  measurementUnit: z.string().max(50, 'attribute:validation.measurementUnitMaxLength').nullable(),
  dataType: z.enum(attributeDataTypes, {
    error: 'attribute:validation.dataTypeInvalid',
  }),
  options: z.array(z.string()).nullable(),
  isActive: z.boolean(),
});

export type CreateAttributeInput = z.infer<typeof createAttributeSchema>;

export const updateAttributeSchema = createAttributeSchema.partial();

export type UpdateAttributeInput = z.infer<typeof updateAttributeSchema>;
