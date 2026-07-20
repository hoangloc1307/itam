import { z } from 'zod';

const assetStatusEnum = z.enum(['AVAILABLE', 'IN_USE', 'UNDER_REPAIR', 'DISPOSED', 'LOST']);

export const createAssetSchema = z.object({
  id: z.string().nonempty('asset:validation.idRequired').max(50, 'asset:validation.idMaxLength'),
  assetCode: z.string().max(50, 'asset:validation.assetCodeMaxLength').nullable(),
  name: z
    .string()
    .nonempty('asset:validation.nameRequired')
    .max(200, 'asset:validation.nameMaxLength'),
  categoryId: z
    .string()
    .nonempty('asset:validation.categoryIdRequired')
    .max(30, 'asset:validation.categoryIdMaxLength'),
  modelId: z.string().max(30).nullable(),
  vendorId: z.string().max(30).nullable(),
  purchaseDate: z.string().nullable(),
  purchasePrice: z.number().nonnegative().nullable(),
  warrantyStartDate: z.string().nullable(),
  warrantyEndDate: z.string().nullable(),
  warrantyMonth: z.number().int().nonnegative().nullable(),
  serialNumber: z.string().max(100).nullable(),
  location: z.string().max(200).nullable(),
  maintenanceIntervalHours: z.number().int().positive().nullable(),
  quantity: z.number().int().positive(),
  remainQuantity: z.number().int().nonnegative(),
  qrCode: z.string().max(255).nullable(),
  assetStatus: assetStatusEnum,
  assignedTo: z.string().max(8).nullable(),
  currentSection: z.string().max(4).nullable(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;

export const updateAssetSchema = createAssetSchema.omit({ id: true }).partial();

export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;

export const batchAssetItemSchema = z.object({
  id: z.string().nonempty('asset:validation.idRequired').max(50, 'asset:validation.idMaxLength'),
  assetCode: z.string().max(50, 'asset:validation.assetCodeMaxLength').nullable(),
  serialNumber: z.string().max(100).nullable(),
});

export const createBatchAssetSchema = z.object({
  name: z
    .string()
    .nonempty('asset:validation.nameRequired')
    .max(200, 'asset:validation.nameMaxLength'),
  categoryId: z
    .string()
    .nonempty('asset:validation.categoryIdRequired')
    .max(30, 'asset:validation.categoryIdMaxLength'),
  modelId: z.string().max(30).nullable(),
  vendorId: z.string().max(30).nullable(),
  purchaseDate: z.string().nullable(),
  purchasePrice: z.number().nonnegative().nullable(),
  warrantyStartDate: z.string().nullable(),
  warrantyEndDate: z.string().nullable(),
  warrantyMonth: z.number().int().nonnegative().nullable(),
  location: z.string().max(200).nullable(),
  maintenanceIntervalHours: z.number().int().positive().nullable(),
  assetStatus: assetStatusEnum,
  items: z.array(batchAssetItemSchema).min(1, 'asset:validation.itemsRequired'),
});

export type BatchAssetItem = z.infer<typeof batchAssetItemSchema>;
export type CreateBatchAssetInput = z.infer<typeof createBatchAssetSchema>;

export { assetStatusEnum };
