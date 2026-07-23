import type { CreateAllocationInput, ReturnAllocationInput } from 'itam-shared/schemas/allocation';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';

interface ListParams {
  search?: string;
  employeeId?: string;
  sectionId?: string;
  assetId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

const list = async ({
  search,
  employeeId,
  sectionId,
  assetId,
  isActive = true,
  page = 1,
  limit = 20,
}: ListParams) => {
  const where: Record<string, unknown> = {
    isActive,
    ...(employeeId ? { employeeId } : {}),
    ...(sectionId ? { sectionId } : {}),
    ...(assetId ? { assetId } : {}),
    ...(search
      ? {
          asset: {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { assetCode: { contains: search, mode: 'insensitive' as const } },
              { id: { contains: search, mode: 'insensitive' as const } },
            ],
          },
        }
      : {}),
  };

  const [data, totalItems] = await Promise.all([
    prisma.assetAllocation.findMany({
      where,
      include: {
        asset: {
          include: {
            category: { select: { id: true, name: true } },
            model: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.assetAllocation.count({ where }),
  ]);

  const mapped = data.map((item) => ({
    id: item.id,
    assetId: item.assetId,
    employeeId: item.employeeId,
    sectionId: item.sectionId,
    quantity: item.quantity,
    assignedDate: item.assignedDate,
    requestNo: item.requestNo,
    note: item.note,
    isActive: item.isActive,
    createdBy: item.createdBy,
    createdAt: item.createdAt,
    updatedBy: item.updatedBy,
    updatedAt: item.updatedAt,
    asset: {
      id: item.asset.id,
      name: item.asset.name,
      assetCode: item.asset.assetCode,
      categoryId: item.asset.categoryId,
      categoryName: item.asset.category.name,
      modelId: item.asset.modelId,
      modelName: item.asset.model?.name ?? null,
      serialNumber: item.asset.serialNumber,
    },
  }));

  return { data: mapped, totalItems };
};

const getById = async (id: number) => {
  const allocation = await prisma.assetAllocation.findUnique({
    where: { id },
    include: {
      asset: {
        include: {
          category: { select: { id: true, name: true } },
          model: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!allocation) {
    throw AppError.notFound(t('allocation:notFound'));
  }

  return {
    ...allocation,
    asset: {
      id: allocation.asset.id,
      name: allocation.asset.name,
      assetCode: allocation.asset.assetCode,
      categoryId: allocation.asset.categoryId,
      categoryName: allocation.asset.category.name,
      modelId: allocation.asset.modelId,
      modelName: allocation.asset.model?.name ?? null,
      serialNumber: allocation.asset.serialNumber,
    },
  };
};

const create = async (input: CreateAllocationInput, createdBy: string) => {
  // Verify asset exists
  const asset = await prisma.asset.findUnique({
    where: { id: input.assetId, deletedAt: null },
  });

  if (!asset) {
    throw AppError.notFound(t('allocation:assetNotFound'));
  }

  // Check remaining quantity
  if (asset.remainQuantity < input.quantity) {
    throw AppError.badRequest(t('allocation:insufficientQuantity'));
  }

  // Must have at least employeeId or sectionId
  if (!input.employeeId && !input.sectionId) {
    throw AppError.badRequest(t('allocation:recipientRequired'));
  }

  // Create allocation and update asset in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const allocation = await tx.assetAllocation.create({
      data: {
        assetId: input.assetId,
        employeeId: input.employeeId ?? null,
        sectionId: input.sectionId ?? null,
        quantity: input.quantity,
        assignedDate: input.assignedDate ? new Date(input.assignedDate) : new Date(),
        requestNo: input.requestNo ?? null,
        note: input.note ?? null,
        createdBy,
      },
    });

    // Decrease remain quantity
    await tx.asset.update({
      where: { id: input.assetId },
      data: {
        remainQuantity: { decrement: input.quantity },
        assetStatus: 'IN_USE',
        ...(input.assetCode ? { assetCode: input.assetCode } : {}),
        updatedBy: createdBy,
        updatedAt: new Date(),
      },
    });

    // Record in asset history
    await tx.assetHistory.create({
      data: {
        assetId: input.assetId,
        type: 'ASSIGN',
        employeeId: null,
        sectionId: null,
        employeeReceiveId: input.employeeId ?? null,
        sectionReceiveId: input.sectionId ?? null,
        quantity: input.quantity,
        note: input.note ?? null,
        createdBy,
      },
    });

    return allocation;
  });

  return result;
};

const returnAllocation = async (id: number, input: ReturnAllocationInput, updatedBy: string) => {
  const allocation = await prisma.assetAllocation.findUnique({ where: { id } });

  if (!allocation) {
    throw AppError.notFound(t('allocation:notFound'));
  }

  if (!allocation.isActive) {
    throw AppError.badRequest(t('allocation:alreadyReturned'));
  }

  const result = await prisma.$transaction(async (tx) => {
    // Deactivate allocation
    const updated = await tx.assetAllocation.update({
      where: { id },
      data: {
        isActive: false,
        note: input.note ?? allocation.note,
        updatedBy,
        updatedAt: new Date(),
      },
    });

    // Increase remain quantity
    const asset = await tx.asset.update({
      where: { id: allocation.assetId },
      data: {
        remainQuantity: { increment: allocation.quantity },
        updatedBy,
        updatedAt: new Date(),
      },
    });

    // If all quantity returned, set status back to AVAILABLE
    if (asset.remainQuantity >= asset.quantity) {
      await tx.asset.update({
        where: { id: allocation.assetId },
        data: { assetStatus: 'AVAILABLE' },
      });
    }

    // Record in asset history
    await tx.assetHistory.create({
      data: {
        assetId: allocation.assetId,
        type: 'RETURN',
        employeeId: allocation.employeeId,
        sectionId: allocation.sectionId,
        employeeReceiveId: null,
        sectionReceiveId: null,
        quantity: allocation.quantity,
        note: input.note ?? null,
        createdBy: updatedBy,
      },
    });

    return updated;
  });

  return result;
};

const remove = async (id: number, deletedBy: string) => {
  const allocation = await prisma.assetAllocation.findUnique({ where: { id } });

  if (!allocation) {
    throw AppError.notFound(t('allocation:notFound'));
  }

  if (!allocation.isActive) {
    throw AppError.badRequest(t('allocation:alreadyReturned'));
  }

  // Same as return - deactivate and restore quantity
  await prisma.$transaction(async (tx) => {
    await tx.assetAllocation.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: deletedBy,
        updatedAt: new Date(),
      },
    });

    const asset = await tx.asset.update({
      where: { id: allocation.assetId },
      data: {
        remainQuantity: { increment: allocation.quantity },
        updatedBy: deletedBy,
        updatedAt: new Date(),
      },
    });

    if (asset.remainQuantity >= asset.quantity) {
      await tx.asset.update({
        where: { id: allocation.assetId },
        data: { assetStatus: 'AVAILABLE' },
      });
    }
  });
};

export const allocationService = { list, getById, create, returnAllocation, remove };
