import type { CreateModelInput, UpdateModelInput } from 'itam-shared/schemas/model';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';

interface ListParams {
  search?: string;
  categoryId?: string;
}

const list = async ({ search, categoryId }: ListParams) => {
  const where = {
    deletedAt: null,
    ...(categoryId ? { categoryId } : {}),
    ...(search
      ? {
          OR: [
            { id: { contains: search } },
            { name: { contains: search, mode: 'insensitive' as const } },
            { modelCode: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const data = await prisma.itemModel.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return data;
};

const getById = async (id: string) => {
  const model = await prisma.itemModel.findUnique({ where: { id, deletedAt: null } });

  if (!model) {
    throw AppError.notFound(t('model:notFound'));
  }

  return model;
};

const create = async (input: CreateModelInput, createdBy: string) => {
  const existing = await prisma.itemModel.findUnique({ where: { id: input.id } });

  if (existing && !existing.deletedAt) {
    throw AppError.conflict(t('model:alreadyExists'));
  }

  if (existing && existing.deletedAt) {
    return prisma.itemModel.update({
      where: { id: input.id },
      data: {
        categoryId: input.categoryId,
        manufacturer: input.manufacturer ?? null,
        name: input.name,
        manageType: input.manageType ?? null,
        modelCode: input.modelCode ?? null,
        isActive: input.isActive,
        deletedAt: null,
        createdBy,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: null,
      },
    });
  }

  return prisma.itemModel.create({
    data: {
      id: input.id,
      categoryId: input.categoryId,
      manufacturer: input.manufacturer ?? null,
      name: input.name,
      manageType: input.manageType ?? null,
      modelCode: input.modelCode ?? null,
      isActive: input.isActive,
      createdBy,
    },
  });
};

const update = async (id: string, input: UpdateModelInput, updatedBy: string) => {
  const existing = await prisma.itemModel.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('model:notFound'));
  }

  return prisma.itemModel.update({
    where: { id },
    data: {
      ...input,
      updatedBy,
      updatedAt: new Date(),
    },
  });
};

const remove = async (id: string) => {
  const existing = await prisma.itemModel.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('model:notFound'));
  }

  return prisma.itemModel.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const modelService = { list, getById, create, update, remove };
