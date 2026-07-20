import type { CreateFeatureInput, UpdateFeatureInput } from 'itam-shared/schemas/feature';
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
            { code: { contains: search } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const data = await prisma.feature.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return data;
};

const getByCode = async (code: string) => {
  const feature = await prisma.feature.findUnique({ where: { code, deletedAt: null } });

  if (!feature) {
    throw AppError.notFound(t('feature:notFound'));
  }

  return feature;
};

const create = async (input: CreateFeatureInput, createdBy: string) => {
  const existing = await prisma.feature.findUnique({ where: { code: input.code } });

  if (existing && !existing.deletedAt) {
    throw AppError.conflict(t('feature:alreadyExists'));
  }

  if (existing && existing.deletedAt) {
    return prisma.feature.update({
      where: { code: input.code },
      data: {
        name: input.name,
        isActive: input.isActive,
        deletedAt: null,
        createdBy,
        createdAt: new Date(),
        updatedBy: null,
        updatedAt: null,
      },
    });
  }

  return prisma.feature.create({
    data: {
      code: input.code,
      name: input.name,
      isActive: input.isActive,
      createdBy,
    },
  });
};

const update = async (code: string, input: UpdateFeatureInput, updatedBy: string) => {
  const existing = await prisma.feature.findUnique({ where: { code, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('feature:notFound'));
  }

  return prisma.feature.update({
    where: { code },
    data: {
      ...input,
      updatedBy,
      updatedAt: new Date(),
    },
  });
};

const remove = async (code: string) => {
  const existing = await prisma.feature.findUnique({ where: { code, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('feature:notFound'));
  }

  return prisma.feature.update({
    where: { code },
    data: { deletedAt: new Date() },
  });
};

export const featureService = { list, getByCode, create, update, remove };
