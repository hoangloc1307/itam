import type {
  CreateUserPermissionInput,
  SyncUserPermissionsInput,
  UpdateUserPermissionInput,
} from 'itam-shared/schemas/user-permission';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';

interface ListParams {
  username?: string;
  featureCode?: string;
}

const list = async ({ username, featureCode }: ListParams) => {
  const where = {
    ...(username ? { username } : {}),
    ...(featureCode ? { featureCode } : {}),
  };

  const data = await prisma.userPermission.findMany({
    where,
    orderBy: [{ username: 'asc' }, { featureCode: 'asc' }, { action: 'asc' }],
    include: {
      user: { select: { name: true } },
      feature: { select: { name: true } },
    },
  });

  return data;
};

const getByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    throw AppError.notFound(t('userPermission:userNotFound'));
  }

  const permissions = await prisma.userPermission.findMany({
    where: { username },
    include: {
      feature: { select: { name: true } },
    },
    orderBy: [{ featureCode: 'asc' }, { action: 'asc' }],
  });

  return { user: { username: user.username, name: user.name }, permissions };
};

const create = async (input: CreateUserPermissionInput) => {
  // Validate user exists
  const user = await prisma.user.findUnique({ where: { username: input.username } });
  if (!user) {
    throw AppError.notFound(t('userPermission:userNotFound'));
  }

  // Validate feature exists
  const feature = await prisma.feature.findUnique({
    where: { code: input.featureCode, deletedAt: null },
  });
  if (!feature) {
    throw AppError.notFound(t('userPermission:featureNotFound'));
  }

  // Check duplicate
  const existing = await prisma.userPermission.findFirst({
    where: {
      username: input.username,
      featureCode: input.featureCode,
      action: input.action as never,
      section: input.section ?? null,
    },
  });

  if (existing) {
    throw AppError.conflict(t('userPermission:alreadyExists'));
  }

  return prisma.userPermission.create({
    data: {
      username: input.username,
      featureCode: input.featureCode,
      action: input.action as never,
      decision: input.decision as never,
      section: input.section ?? null,
    },
  });
};

const syncByUser = async (input: SyncUserPermissionsInput) => {
  const { username, permissions } = input;

  // Validate user exists
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw AppError.notFound(t('userPermission:userNotFound'));
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
      throw AppError.notFound(t('userPermission:featureNotFound'));
    }
  }

  // Delete existing permissions for this user and re-create
  await prisma.$transaction(async (tx) => {
    await tx.userPermission.deleteMany({ where: { username } });

    if (permissions.length > 0) {
      await tx.userPermission.createMany({
        data: permissions.map((p) => ({
          username,
          featureCode: p.featureCode,
          action: p.action as never,
          decision: p.decision as never,
          section: p.section ?? null,
        })),
      });
    }
  });

  // Return updated permissions
  return prisma.userPermission.findMany({
    where: { username },
    orderBy: [{ featureCode: 'asc' }, { action: 'asc' }],
  });
};

const update = async (id: number, input: UpdateUserPermissionInput) => {
  const existing = await prisma.userPermission.findUnique({ where: { id } });
  if (!existing) {
    throw AppError.notFound(t('userPermission:notFound'));
  }

  // Validate feature exists
  const feature = await prisma.feature.findUnique({
    where: { code: input.featureCode, deletedAt: null },
  });
  if (!feature) {
    throw AppError.notFound(t('userPermission:featureNotFound'));
  }

  // Check duplicate (excluding current record)
  const duplicate = await prisma.userPermission.findFirst({
    where: {
      id: { not: id },
      username: existing.username,
      featureCode: input.featureCode,
      action: input.action as never,
      section: input.section ?? null,
    },
  });

  if (duplicate) {
    throw AppError.conflict(t('userPermission:alreadyExists'));
  }

  return prisma.userPermission.update({
    where: { id },
    data: {
      featureCode: input.featureCode,
      action: input.action as never,
      decision: input.decision as never,
      section: input.section ?? null,
    },
  });
};

const remove = async (id: number) => {
  const existing = await prisma.userPermission.findUnique({ where: { id } });

  if (!existing) {
    throw AppError.notFound(t('userPermission:notFound'));
  }

  return prisma.userPermission.delete({ where: { id } });
};

export const userPermissionService = { list, getByUsername, create, update, syncByUser, remove };
