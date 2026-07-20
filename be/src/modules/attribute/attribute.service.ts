import type { CreateAttributeInput, UpdateAttributeInput } from 'itam-shared/schemas/attribute';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { prisma } from '~/lib/prisma';

interface ListParams {
  search?: string;
}

const list = async ({ search }: ListParams) => {
  const where = {
    deletedAt: null,
    ...(search
      ? {
          name: { contains: search, mode: 'insensitive' as const },
        }
      : {}),
  };

  const data = await prisma.attribute.findMany({
    where,
    include: { group: { select: { id: true, name: true, sortOrder: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return data;
};

const getById = async (id: number) => {
  const attribute = await prisma.attribute.findUnique({ where: { id, deletedAt: null } });

  if (!attribute) {
    throw AppError.notFound(t('attribute:notFound'));
  }

  return attribute;
};

const create = async (input: CreateAttributeInput, createdBy: string) => {
  return prisma.attribute.create({
    data: {
      name: input.name,
      groupId: input.groupId ?? null,
      measurementUnit: input.measurementUnit ?? null,
      dataType: input.dataType,
      options: input.options ?? undefined,
      createdBy,
    },
  });
};

const update = async (id: number, input: UpdateAttributeInput, updatedBy: string) => {
  const existing = await prisma.attribute.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('attribute:notFound'));
  }

  return prisma.attribute.update({
    where: { id },
    data: {
      ...input,
      options: input.options ?? undefined,
      updatedBy,
      updatedAt: new Date(),
    },
  });
};

const remove = async (id: number) => {
  const existing = await prisma.attribute.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('attribute:notFound'));
  }

  return prisma.attribute.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const attributeService = { list, getById, create, update, remove };
