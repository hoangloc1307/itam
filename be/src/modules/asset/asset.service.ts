import type {
  CreateAssetInput,
  CreateBatchAssetInput,
  UpdateAssetInput,
} from 'itam-shared/schemas/asset';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { documentSequenceService } from '~/modules/document-sequence/document-sequence.service';

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
  const asset = await prisma.asset.findUnique({
    where: { id, deletedAt: null },
    include: {
      attributeValues: {
        include: {
          attribute: {
            select: {
              id: true,
              name: true,
              measurementUnit: true,
              dataType: true,
              options: true,
              groupId: true,
              group: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!asset) {
    throw AppError.notFound(t('asset:notFound'));
  }

  // Get category attributes to include all fields (even those without values)
  const categoryAttributes = await prisma.categoryAttribute.findMany({
    where: { categoryId: asset.categoryId },
    include: {
      attribute: {
        select: {
          id: true,
          name: true,
          measurementUnit: true,
          dataType: true,
          options: true,
          groupId: true,
          group: { select: { name: true } },
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  const valueMap = new Map(asset.attributeValues.map((v) => [v.attributeId, v.value]));

  const attributeValues = categoryAttributes.map((ca) => ({
    attributeId: ca.attribute.id,
    name: ca.attribute.name,
    measurementUnit: ca.attribute.measurementUnit,
    dataType: ca.attribute.dataType,
    options: ca.attribute.options as string[] | null,
    groupId: ca.attribute.groupId,
    groupName: ca.attribute.group?.name ?? null,
    isRequired: ca.isRequired,
    value: valueMap.get(ca.attribute.id) ?? null,
  }));

  const { attributeValues: _av, ...assetData } = asset;

  return { ...assetData, attributeValues };
};

const create = async (input: CreateAssetInput, createdBy: string) => {
  const { attributeValues, ...assetData } = input;

  // Generate management code (id) from category's serial key if not provided
  let managementId = assetData.id;
  if (!managementId) {
    const category = await prisma.category.findUnique({
      where: { id: assetData.categoryId },
      select: { serialKey: true },
    });
    if (category?.serialKey) {
      const result = await documentSequenceService.generateCode(category.serialKey);
      managementId = result.code;
    }
  }

  const existing = await prisma.asset.findUnique({ where: { id: managementId } });

  if (existing && !existing.deletedAt) {
    throw AppError.conflict(t('asset:alreadyExists'));
  }

  const asset = await prisma.$transaction(async (tx) => {
    let created;

    if (existing && existing.deletedAt) {
      created = await tx.asset.update({
        where: { id: managementId },
        data: {
          assetCode: assetData.assetCode ?? null,
          name: assetData.name,
          categoryId: assetData.categoryId,
          modelId: assetData.modelId ?? null,
          vendorId: assetData.vendorId ?? null,
          purchaseDate: assetData.purchaseDate ? new Date(assetData.purchaseDate) : null,
          purchasePrice: assetData.purchasePrice ?? null,
          warrantyStartDate: assetData.warrantyStartDate
            ? new Date(assetData.warrantyStartDate)
            : null,
          warrantyEndDate: assetData.warrantyEndDate ? new Date(assetData.warrantyEndDate) : null,
          warrantyMonth: assetData.warrantyMonth ?? null,
          serialNumber: assetData.serialNumber ?? null,
          location: assetData.location ?? null,
          maintenanceIntervalHours: assetData.maintenanceIntervalHours ?? null,
          quantity: assetData.quantity,
          remainQuantity: assetData.remainQuantity,
          qrCode: assetData.qrCode ?? null,
          assetStatus: assetData.assetStatus,
          deletedAt: null,
          createdBy,
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: null,
        },
      });

      // Remove old attribute values
      await tx.assetAttributeValue.deleteMany({ where: { assetId: created.id } });
    } else {
      created = await tx.asset.create({
        data: {
          id: managementId,
          assetCode: assetData.assetCode ?? null,
          name: assetData.name,
          categoryId: assetData.categoryId,
          modelId: assetData.modelId ?? null,
          vendorId: assetData.vendorId ?? null,
          purchaseDate: assetData.purchaseDate ? new Date(assetData.purchaseDate) : null,
          purchasePrice: assetData.purchasePrice ?? null,
          warrantyStartDate: assetData.warrantyStartDate
            ? new Date(assetData.warrantyStartDate)
            : null,
          warrantyEndDate: assetData.warrantyEndDate ? new Date(assetData.warrantyEndDate) : null,
          warrantyMonth: assetData.warrantyMonth ?? null,
          serialNumber: assetData.serialNumber ?? null,
          location: assetData.location ?? null,
          maintenanceIntervalHours: assetData.maintenanceIntervalHours ?? null,
          quantity: assetData.quantity,
          remainQuantity: assetData.remainQuantity,
          qrCode: assetData.qrCode ?? null,
          assetStatus: assetData.assetStatus,
          createdBy,
        },
      });
    }

    // Insert attribute values
    if (attributeValues && attributeValues.length > 0) {
      const toInsert = attributeValues.filter(
        (v) => v.value !== null && v.value !== undefined && v.value !== '',
      );
      if (toInsert.length > 0) {
        await tx.assetAttributeValue.createMany({
          data: toInsert.map((v) => ({
            assetId: created.id,
            attributeId: v.attributeId,
            value: v.value,
          })),
        });
      }
    }

    return created;
  });

  return asset;
};

const update = async (id: string, input: UpdateAssetInput, updatedBy: string) => {
  const existing = await prisma.asset.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('asset:notFound'));
  }

  const { attributeValues, ...updateData } = input;

  return prisma.$transaction(async (tx) => {
    const updated = await tx.asset.update({
      where: { id },
      data: {
        ...updateData,
        purchaseDate:
          updateData.purchaseDate !== undefined
            ? updateData.purchaseDate
              ? new Date(updateData.purchaseDate)
              : null
            : undefined,
        warrantyStartDate:
          updateData.warrantyStartDate !== undefined
            ? updateData.warrantyStartDate
              ? new Date(updateData.warrantyStartDate)
              : null
            : undefined,
        warrantyEndDate:
          updateData.warrantyEndDate !== undefined
            ? updateData.warrantyEndDate
              ? new Date(updateData.warrantyEndDate)
              : null
            : undefined,
        updatedBy,
        updatedAt: new Date(),
      },
    });

    // Update attribute values if provided
    if (attributeValues !== undefined) {
      // Delete all existing attribute values
      await tx.assetAttributeValue.deleteMany({ where: { assetId: id } });

      // Insert new values
      if (attributeValues && attributeValues.length > 0) {
        const toInsert = attributeValues.filter(
          (v) => v.value !== null && v.value !== undefined && v.value !== '',
        );
        if (toInsert.length > 0) {
          await tx.assetAttributeValue.createMany({
            data: toInsert.map((v) => ({
              assetId: id,
              attributeId: v.attributeId,
              value: v.value,
            })),
          });
        }
      }
    }

    return updated;
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
  const manualIds = input.items.map((item) => item.id).filter((id) => id);

  if (manualIds.length > 0) {
    const existingAssets = await prisma.asset.findMany({
      where: { id: { in: manualIds }, deletedAt: null },
    });

    if (existingAssets.length > 0) {
      const conflictIds = existingAssets.map((a) => a.id).join(', ');
      throw AppError.conflict(t('asset:batchConflict', { ids: conflictIds }));
    }
  }

  // Generate asset codes from category's serial key
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
    select: { serialKey: true },
  });

  const data = await Promise.all(
    input.items.map(async (item) => {
      let itemId = item.id;
      if (!itemId && category?.serialKey) {
        const result = await documentSequenceService.generateCode(category.serialKey);
        itemId = result.code;
      }

      return {
        id: itemId,
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
      };
    }),
  );

  const result = await prisma.asset.createMany({ data });

  // Save attribute values for each asset
  if (input.attributeValues && input.attributeValues.length > 0) {
    const createdIds = data.map((d) => d.id);
    const attrData = createdIds.flatMap((assetId) =>
      input
        .attributeValues!.filter(
          (av) => av.value !== null && av.value !== undefined && av.value !== '',
        )
        .map((av) => ({
          assetId,
          attributeId: av.attributeId,
          value: av.value ?? null,
        })),
    );
    if (attrData.length > 0) {
      await prisma.assetAttributeValue.createMany({ data: attrData });
    }
  }

  return { count: result.count };
};

export const assetService = { list, getById, create, createBatch, update, remove };
