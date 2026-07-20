import type {
  CreateRolePermissionInput,
  SyncRolePermissionsInput,
  UpdateRolePermissionInput,
} from 'itam-shared/schemas/role-permission';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';

interface ListParams {
  roleCode?: string;
  featureCode?: string;
}

const list = async ({ roleCode, featureCode }: ListParams) => {
  const where = {
    ...(roleCode ? { roleCode } : {}),
    ...(featureCode ? { featureCode } : {}),
  };

  const data = await prisma.rolePermission.findMany({
    where,
    orderBy: [{ roleCode: 'asc' }, { featureCode: 'asc' }, { action: 'asc' }],
    include: {
      role: { select: { name: true } },
      feature: { select: { name: true } },
    },
  });

  return data;
};

const getByRoleCode = async (roleCode: string) => {
  const role = await prisma.role.findUnique({ where: { code: roleCode, deletedAt: null } });

  if (!role) {
    throw AppError.notFound(t('rolePermission:roleNotFound'));
  }

  const permissions = await prisma.rolePermission.findMany({
    where: { roleCode },
    include: {
      feature: { select: { name: true } },
    },
    orderBy: [{ featureCode: 'asc' }, { action: 'asc' }],
  });

  return { role, permissions };
};

const create = async (input: CreateRolePermissionInput) => {
  // Validate role exists
  const role = await prisma.role.findUnique({ where: { code: input.roleCode, deletedAt: null } });
  if (!role) {
    throw AppError.notFound(t('rolePermission:roleNotFound'));
  }

  // Validate feature exists
  const feature = await prisma.feature.findUnique({
    where: { code: input.featureCode, deletedAt: null },
  });
  if (!feature) {
    throw AppError.notFound(t('rolePermission:featureNotFound'));
  }

  // Check duplicate
  const existing = await prisma.rolePermission.findFirst({
    where: {
      roleCode: input.roleCode,
      featureCode: input.featureCode,
      action: input.action as never,
      section: input.section ?? null,
    },
  });

  if (existing) {
    throw AppError.conflict(t('rolePermission:alreadyExists'));
  }

  return prisma.rolePermission.create({
    data: {
      roleCode: input.roleCode,
      featureCode: input.featureCode,
      action: input.action as never,
      section: input.section ?? null,
    },
  });
};

const syncByRole = async (input: SyncRolePermissionsInput) => {
  const { roleCode, permissions } = input;

  // Validate role exists
  const role = await prisma.role.findUnique({ where: { code: roleCode, deletedAt: null } });
  if (!role) {
    throw AppError.notFound(t('rolePermission:roleNotFound'));
  }

  // Validate all feature codes exist
  const featureCodes = [...new Set(permissions.map((p) => p.featureCode))];
  const features = await prisma.feature.findMany({
    where: { code: { in: featureCodes }, deletedAt: null },
    select: { code: true },
  });
  const validFeatureCodes = new Set(features.map((f) => f.code));

  for (const fc of featureCodes) {
    if (!validFeatureCodes.has(fc)) {
      throw AppError.notFound(t('rolePermission:featureNotFound'));
    }
  }

  // Delete existing permissions for this role and re-create
  await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleCode } });

    if (permissions.length > 0) {
      await tx.rolePermission.createMany({
        data: permissions.map((p) => ({
          roleCode,
          featureCode: p.featureCode,
          action: p.action as never,
          section: p.section ?? null,
        })),
      });
    }
  });

  // Return updated permissions
  return prisma.rolePermission.findMany({
    where: { roleCode },
    orderBy: [{ featureCode: 'asc' }, { action: 'asc' }],
  });
};

const update = async (id: number, input: UpdateRolePermissionInput) => {
  const existing = await prisma.rolePermission.findUnique({ where: { id } });
  if (!existing) {
    throw AppError.notFound(t('rolePermission:notFound'));
  }

  // Validate feature exists
  const feature = await prisma.feature.findUnique({
    where: { code: input.featureCode, deletedAt: null },
  });
  if (!feature) {
    throw AppError.notFound(t('rolePermission:featureNotFound'));
  }

  // Check duplicate (excluding current record)
  const duplicate = await prisma.rolePermission.findFirst({
    where: {
      id: { not: id },
      roleCode: existing.roleCode,
      featureCode: input.featureCode,
      action: input.action as never,
      section: input.section ?? null,
    },
  });

  if (duplicate) {
    throw AppError.conflict(t('rolePermission:alreadyExists'));
  }

  return prisma.rolePermission.update({
    where: { id },
    data: {
      featureCode: input.featureCode,
      action: input.action as never,
      section: input.section ?? null,
    },
  });
};

const remove = async (id: number) => {
  const existing = await prisma.rolePermission.findUnique({ where: { id } });

  if (!existing) {
    throw AppError.notFound(t('rolePermission:notFound'));
  }

  return prisma.rolePermission.delete({ where: { id } });
};

export const rolePermissionService = { list, getByRoleCode, create, update, syncByRole, remove };
