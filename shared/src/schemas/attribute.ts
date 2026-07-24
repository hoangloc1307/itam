import { z } from 'zod';
import { ATTRIBUTE_DATA_TYPES } from '../constants/attribute';

export type { AttributeDataType } from '../constants/attribute';

export const createAttributeSchema = z.object({
  name: z
    .string()
    .nonempty('attribute:validation.nameRequired')
    .max(150, 'attribute:validation.nameMaxLength'),
  groupId: z
    .union([z.number().int(), z.string()])
    .nullable()
    .transform((val) => (typeof val === 'string' ? (val ? Number(val) : null) : val)),
  measurementUnit: z.string().max(50, 'attribute:validation.measurementUnitMaxLength').nullable(),
  dataType: z.enum(ATTRIBUTE_DATA_TYPES, {
    error: 'attribute:validation.dataTypeInvalid',
  }),
  options: z.array(z.string()).nullable(),
  isActive: z.boolean(),
});

export type CreateAttributeInput = z.infer<typeof createAttributeSchema>;

/** Form-level schema (groupId as string for ComboboxField) */
export const attributeFormSchema = createAttributeSchema.omit({ groupId: true }).extend({
  groupId: z.string(),
});

export const updateAttributeSchema = createAttributeSchema.partial();

export type UpdateAttributeInput = z.infer<typeof updateAttributeSchema>;
