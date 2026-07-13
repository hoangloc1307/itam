import type {
  CreateUserRoleInput,
  SyncUserRolesInput,
  UpdateUserRoleInput,
} from 'itam-shared/schemas/user-role';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';

interface ListParams {
  page: number;
  limit: number;
  username?: string;
  roleCode?: string;
}

const list = async ({ page, limit, username, roleCode }: ListParams) => {
  const where = {
    ...(username ? { username } : {}),
    ...(roleCode ? { roleCode } : {}),
  };

  const [data, totalItems] = await Promise.all([
    prisma.userRole.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ username: 'asc' }, { roleCode: 'asc' }],
      include: {
        user: { select: { name: true } },
        role: { select: { name: true } },
      },
    }),
    prisma.userRole.count({ where }),
  ]);

  return { data, totalItems };
};

const getByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    throw AppError.notFound(t('userRole:userNotFound'));
  }

  const roles = await prisma.userRole.findMany({
    where: { username },
    include: {
      role: { select: { name: true } },
    },
    orderBy: [{ roleCode: 'asc' }],
  });

  return { user: { username: user.username, name: user.name }, roles };
};

const create = async (input: CreateUserRoleInput) => {
  // Validate user exists
  const user = await prisma.user.findUnique({ where: { username: input.username } });
  if (!user) {
    throw AppError.notFound(t('userRole:userNotFound'));
  }

  // Validate role exists
  const role = await prisma.role.findUnique({ where: { code: input.roleCode, deletedAt: null } });
  if (!role) {
    throw AppError.notFound(t('userRole:roleNotFound'));
  }

  // Check duplicate
  const existing = await prisma.userRole.findFirst({
    where: {
      username: input.username,
      roleCode: input.roleCode,
      section: input.section ?? null,
    },
  });

  if (existing) {
    throw AppError.conflict(t('userRole:alreadyExists'));
  }

  return prisma.userRole.create({
    data: {
      username: input.username,
      roleCode: input.roleCode,
      section: input.section ?? null,
    },
  });
};

const syncByUser = async (input: SyncUserRolesInput) => {
  const { username, roles } = input;

  // Validate user exists
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw AppError.notFound(t('userRole:userNotFound'));
  }

  // Validate all role codes exist
  const roleCodes = [...new Set(roles.map((r) => r.roleCode))];
  const existingRoles = await prisma.role.findMany({
    where: { code: { in: roleCodes }, deletedAt: null },
    select: { code: true },
  });
  const validRoleCodes = new Set(existingRoles.map((r) => r.code));

  for (const rc of roleCodes) {
    if (!validRoleCodes.has(rc)) {
      throw AppError.notFound(t('userRole:roleNotFound'));
    }
  }

  // Delete existing roles for this user and re-create
  await prisma.$transaction(async (tx) => {
    await tx.userRole.deleteMany({ where: { username } });

    if (roles.length > 0) {
      await tx.userRole.createMany({
        data: roles.map((r) => ({
          username,
          roleCode: r.roleCode,
          section: r.section ?? null,
        })),
      });
    }
  });

  // Return updated roles
  return prisma.userRole.findMany({
    where: { username },
    orderBy: [{ roleCode: 'asc' }],
  });
};

const update = async (id: number, input: UpdateUserRoleInput) => {
  const existing = await prisma.userRole.findUnique({ where: { id } });
  if (!existing) {
    throw AppError.notFound(t('userRole:notFound'));
  }

  // Validate role exists
  const role = await prisma.role.findUnique({ where: { code: input.roleCode, deletedAt: null } });
  if (!role) {
    throw AppError.notFound(t('userRole:roleNotFound'));
  }

  // Check duplicate (excluding current record)
  const duplicate = await prisma.userRole.findFirst({
    where: {
      id: { not: id },
      username: existing.username,
      roleCode: input.roleCode,
      section: input.section ?? null,
    },
  });

  if (duplicate) {
    throw AppError.conflict(t('userRole:alreadyExists'));
  }

  return prisma.userRole.update({
    where: { id },
    data: {
      roleCode: input.roleCode,
      section: input.section ?? null,
    },
  });
};

const remove = async (id: number) => {
  const existing = await prisma.userRole.findUnique({ where: { id } });

  if (!existing) {
    throw AppError.notFound(t('userRole:notFound'));
  }

  return prisma.userRole.delete({ where: { id } });
};

export const userRoleService = { list, getByUsername, create, update, syncByUser, remove };
