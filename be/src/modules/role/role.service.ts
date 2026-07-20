import type { CreateRoleInput, UpdateRoleInput } from 'itam-shared/schemas/role';
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
            { code: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const data = await prisma.role.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return data;
};

const getByCode = async (code: string) => {
  const role = await prisma.role.findUnique({ where: { code, deletedAt: null } });

  if (!role) {
    throw AppError.notFound(t('role:notFound'));
  }

  return role;
};

const create = async (input: CreateRoleInput, createdBy: string) => {
  const existing = await prisma.role.findUnique({ where: { code: input.code } });

  if (existing && !existing.deletedAt) {
    throw AppError.conflict(t('role:alreadyExists'));
  }

  if (existing && existing.deletedAt) {
    return prisma.role.update({
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

  return prisma.role.create({
    data: {
      code: input.code,
      name: input.name,
      isActive: input.isActive,
      createdBy,
    },
  });
};

const update = async (code: string, input: UpdateRoleInput, updatedBy: string) => {
  const existing = await prisma.role.findUnique({ where: { code, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('role:notFound'));
  }

  return prisma.role.update({
    where: { code },
    data: {
      ...input,
      updatedBy,
      updatedAt: new Date(),
    },
  });
};

const remove = async (code: string) => {
  const existing = await prisma.role.findUnique({ where: { code, deletedAt: null } });

  if (!existing) {
    throw AppError.notFound(t('role:notFound'));
  }

  return prisma.role.update({
    where: { code },
    data: { deletedAt: new Date() },
  });
};

export const roleService = { list, getByCode, create, update, remove };
