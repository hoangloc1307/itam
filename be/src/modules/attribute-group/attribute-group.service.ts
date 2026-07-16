import type {
  CreateAttributeGroupInput,
  UpdateAttributeGroupInput,
} from 'itam-shared/schemas/attribute-group';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { prisma } from '~/lib/prisma';

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
          name: { contains: search, mode: 'insensitive' as const },
        }
      : {}),
  };

  const [data, totalItems] = await Promise.all([
    prisma.attributeGroup.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.attributeGroup.count({ where }),
  ]);

  return { data, totalItems };
};

const getById = async (id: number) => {
  const group = await prisma.attributeGroup.findUnique({ where: { id, deletedAt: null } });

  if (!group) {
    throw AppError.notFound(t('attributeGroup:notFound'));
  }

  return group;
};

const create = async (input: CreateAttributeGroupInput, createdBy: string) => {
  return prisma.attributeGroup.create({
    data: {
      name: input.name,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive,
      createdBy,
    },
  });
};

const update = async (id: number, input: UpdateAttributeGroupInput, updatedBy: string) => {
  const existing = await prisma.attributeGroup.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('attributeGroup:notFound'));
  }

  return prisma.attributeGroup.update({
    where: { id },
    data: {
      ...input,
      updatedBy,
      updatedAt: new Date(),
    },
  });
};

const remove = async (id: number) => {
  const existing = await prisma.attributeGroup.findUnique({ where: { id, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('attributeGroup:notFound'));
  }

  return prisma.attributeGroup.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const attributeGroupService = { list, getById, create, update, remove };
