import type {
  CreateAssetInput,
  CreateBatchAssetInput,
  UpdateAssetInput,
} from 'itam-shared/schemas/asset';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';

interface ListParams {
  search?: string;
}

const list = async ({ search }: ListParams) => {
  const where = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { id: { contains: search } },
            { name: { contains: search, mode: 'insensitive' as const } },
            { assetCode: { contains: search, mode: 'insensitive' as const } },
            { serialNumber: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const data = await prisma.asset.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return data;
};

const getById = async (id: string) => {
  const asset = await prisma.asset.findUnique({ where: { id, deletedAt: null } });

  if (!asset) {
    throw AppError.notFound(t('asset:notFound'));
  }

  return asset;
};

const create = async (input: CreateAssetInput, createdBy: string) => {
  const existing = await prisma.asset.findUnique({ where: { id: input.id } });

  if (existing && !existing.deletedAt) {
    throw AppError.conflict(t('asset:alreadyExists'));
  }

  if (existing && existing.deletedAt) {
    return prisma.asset.update({
      where: { id: input.id },
      data: {
        assetCode: input.assetCode ?? null,
        name: input.name,
        categoryId: input.categoryId,
        modelId: input.modelId ?? null,
        vendorId: input.vendorId ?? null,
        purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : null,
        purchasePrice: input.purchasePrice ?? null,
        warrantyStartDate: input.warrantyStartDate ? new Date(input.warrantyStartDate) : null,
        warrantyEndDate: input.warrantyEndDate ? new Date(input.warrantyEndDate) : null,
        warrantyMonth: input.warrantyMonth ?? null,
        serialNumber: input.serialNumber ?? null,
        location: input.location ?? null,
        maintenanceIntervalHours: input.maintenanceIntervalHours ?? null,
        quantity: input.quantity,
        remainQuantity: input.remainQuantity,
        qrCode: input.qrCode ?? null,
        assetStatus: input.assetStatus,
        assignedTo: input.assignedTo ?? null,
        currentSection: input.currentSection ?? null,
        deletedAt: null,
        createdBy,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: null,
      },
    });
  }

  return prisma.asset.create({
    data: {
      id: input.id,
      assetCode: input.assetCode ?? null,
      name: input.name,
      categoryId: input.categoryId,
      modelId: input.modelId ?? null,
      vendorId: input.vendorId ?? null,
      purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : null,
      purchasePrice: input.purchasePrice ?? null,
      warrantyStartDate: input.warrantyStartDate ? new Date(input.warrantyStartDate) : null,
      warrantyEndDate: input.warrantyEndDate ? new Date(input.warrantyEndDate) : null,
      warrantyMonth: input.warrantyMonth ?? null,
      serialNumber: input.serialNumber ?? null,
      location: input.location ?? null,
      maintenanceIntervalHours: input.maintenanceIntervalHours ?? null,
      quantity: input.quantity,
      remainQuantity: input.remainQuantity,
      qrCode: input.qrCode ?? null,
      assetStatus: input.assetStatus,
      assignedTo: input.assignedTo ?? null,
      currentSection: input.currentSection ?? null,
      createdBy,
    },
  });
};

const update = async (id: string, input: UpdateAssetInput, updatedBy: string) => {
  const existing = await prisma.asset.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('asset:notFound'));
  }

  return prisma.asset.update({
    where: { id },
    data: {
      ...input,
      purchaseDate:
        input.purchaseDate !== undefined
          ? input.purchaseDate
            ? new Date(input.purchaseDate)
            : null
          : undefined,
      warrantyStartDate:
        input.warrantyStartDate !== undefined
          ? input.warrantyStartDate
            ? new Date(input.warrantyStartDate)
            : null
          : undefined,
      warrantyEndDate:
        input.warrantyEndDate !== undefined
          ? input.warrantyEndDate
            ? new Date(input.warrantyEndDate)
            : null
          : undefined,
      updatedBy,
      updatedAt: new Date(),
    },
  });
};

const remove = async (id: string) => {
  const existing = await prisma.asset.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('asset:notFound'));
  }

  return prisma.asset.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const createBatch = async (input: CreateBatchAssetInput, createdBy: string) => {
  const ids = input.items.map((item) => item.id);

  const existingAssets = await prisma.asset.findMany({
    where: { id: { in: ids }, deletedAt: null },
  });

  if (existingAssets.length > 0) {
    const conflictIds = existingAssets.map((a) => a.id).join(', ');
    throw AppError.conflict(t('asset:batchConflict', { ids: conflictIds }));
  }

  const data = input.items.map((item) => ({
    id: item.id,
    assetCode: item.assetCode ?? null,
    serialNumber: item.serialNumber ?? null,
    name: input.name,
    categoryId: input.categoryId,
    modelId: input.modelId ?? null,
    vendorId: input.vendorId ?? null,
    purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : null,
    purchasePrice: input.purchasePrice ?? null,
    warrantyStartDate: input.warrantyStartDate ? new Date(input.warrantyStartDate) : null,
    warrantyEndDate: input.warrantyEndDate ? new Date(input.warrantyEndDate) : null,
    warrantyMonth: input.warrantyMonth ?? null,
    location: input.location ?? null,
    maintenanceIntervalHours: input.maintenanceIntervalHours ?? null,
    assetStatus: input.assetStatus,
    quantity: 1,
    remainQuantity: 1,
    createdBy,
  }));

  const result = await prisma.asset.createMany({ data });

  return { count: result.count };
};

export const assetService = { list, getById, create, createBatch, update, remove };
