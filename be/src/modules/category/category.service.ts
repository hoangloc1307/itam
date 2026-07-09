import type { CreateCategoryInput, UpdateCategoryInput } from 'itam-shared/schemas/category';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';

interface ListParams {
  page: number;
  limit: number;
  search?: string;
}

const list = async ({ page, limit, search }: ListParams) => {
  const where = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { id: { contains: search } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [data, totalItems] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.count({ where }),
  ]);

  return { data, totalItems };
};

const getById = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id, deletedAt: null } });

  if (!category) {
    throw AppError.notFound(t('category:notFound'));
  }

  return category;
};

const create = async (input: CreateCategoryInput, createdBy: string) => {
  const existing = await prisma.category.findUnique({ where: { id: input.id } });

  if (existing && !existing.deletedAt) {
    throw AppError.conflict(t('category:alreadyExists'));
  }

  if (existing && existing.deletedAt) {
    return prisma.category.update({
      where: { id: input.id },
      data: {
        name: input.name,
        serialKey: input.serialKey,
        maintenanceIntervalHours: input.maintenanceIntervalHours ?? null,
        isActive: input.isActive,
        deletedAt: null,
        createdBy,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: null,
      },
    });
  }

  return prisma.category.create({
    data: {
      id: input.id,
      name: input.name,
      serialKey: input.serialKey,
      maintenanceIntervalHours: input.maintenanceIntervalHours ?? null,
      createdBy,
    },
  });
};

const update = async (id: string, input: UpdateCategoryInput, updatedBy: string) => {
  const existing = await prisma.category.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('category:notFound'));
  }

  return prisma.category.update({
    where: { id },
    data: {
      ...input,
      updatedBy,
      updatedAt: new Date(),
    },
  });
};

const remove = async (id: string) => {
  const existing = await prisma.category.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('category:notFound'));
  }

  return prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const categoryService = { list, getById, create, update, remove };
