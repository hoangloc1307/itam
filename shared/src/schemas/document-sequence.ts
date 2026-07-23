import { z } from 'zod';
import { RESET_CYCLES } from '../constants/document-sequence';

export type { ResetCycle } from '../constants/document-sequence';

export const createDocumentSequenceSchema = z.object({
  code: z
    .string()
    .nonempty('documentSequence:validation.codeRequired')
    .max(50, 'documentSequence:validation.codeMaxLength'),
  name: z
    .string()
    .nonempty('documentSequence:validation.nameRequired')
    .max(150, 'documentSequence:validation.nameMaxLength'),
  prefix: z.string().max(20, 'documentSequence:validation.prefixMaxLength'),
  separator: z.string().max(5, 'documentSequence:validation.separatorMaxLength'),
  dateFormat: z.string().max(20, 'documentSequence:validation.dateFormatMaxLength'),
  paddingLength: z
    .number()
    .int()
    .min(1, 'documentSequence:validation.paddingLengthMin')
    .max(10, 'documentSequence:validation.paddingLengthMax'),
  resetCycle: z.enum(RESET_CYCLES, { message: 'documentSequence:validation.resetCycleInvalid' }),
  isActive: z.boolean(),
});

export type CreateDocumentSequenceInput = z.infer<typeof createDocumentSequenceSchema>;

export const updateDocumentSequenceSchema = createDocumentSequenceSchema
  .omit({ code: true })
  .partial();

export type UpdateDocumentSequenceInput = z.infer<typeof updateDocumentSequenceSchema>;
