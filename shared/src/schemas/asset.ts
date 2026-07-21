import { z } from 'zod';
import { ASSET_STATUSES } from '../constants/asset-statuses';

const assetStatusEnum = z.enum([
  ASSET_STATUSES.AVAILABLE,
  ASSET_STATUSES.IN_USE,
  ASSET_STATUSES.UNDER_REPAIR,
  ASSET_STATUSES.DISPOSED,
  ASSET_STATUSES.LOST,
]);

export const assetAttributeValueSchema = z.object({
  attributeId: z.number().int().positive(),
  value: z.string().nullable(),
});

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
  attributeValues: z.array(assetAttributeValueSchema).optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;

export const updateAssetSchema = createAssetSchema
  .omit({ id: true })
  .partial()
  .extend({
    attributeValues: z.array(assetAttributeValueSchema).optional(),
  });

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
