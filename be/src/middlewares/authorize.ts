import type { NextFunction, Request, Response } from 'express';
import type { Action } from 'itam-shared/constants';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { prisma } from '~/lib/prisma';

export const authorize = (featureCode: string, action: Action) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const username = req.user?.username;

    if (!username) {
      throw AppError.unauthorized(t('auth:unauthorized'));
    }

    const hasPermission = await checkPermission(username, featureCode, action);

    if (!hasPermission) {
      throw AppError.forbidden(t('common:forbidden'));
    }

    next();
  };
};

async function checkPermission(
  username: string,
  featureCode: string,
  action: Action,
): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { username, role: { isActive: true, deletedAt: null } },
    select: { roleCode: true, section: true },
  });

  const roleCodes = [...new Set(userRoles.map((ur) => ur.roleCode))];

  const rolePermissions = await prisma.rolePermission.findMany({
    where: {
      roleCode: { in: roleCodes },
      featureCode,
      action: { in: [action, 'MANAGE'] },
      feature: { isActive: true, deletedAt: null },
    },
    select: { roleCode: true, section: true },
  });

  // So sánh section: RolePermission.section phải match UserRole.section
  const hasRolePermission = rolePermissions.some((rp) =>
    userRoles.some(
      (ur) =>
        ur.roleCode === rp.roleCode &&
        (rp.section === null || ur.section === null || rp.section === ur.section),
    ),
  );

  if (hasRolePermission) {
    // 3. Check nếu bị DENY bởi UserPermission (chỉ DENY nếu section match hoặc DENY toàn hệ thống)
    const userSections = userRoles.map((ur) => ur.section);
    const denied = await prisma.userPermission.findFirst({
      where: {
        username,
        featureCode,
        action,
        decision: 'DENY',
        feature: { isActive: true, deletedAt: null },
        OR: [
          { section: null }, // DENY toàn hệ thống
          { section: { in: userSections.filter((s): s is string => s !== null) } },
        ],
      },
    });

    // Nếu không bị DENY → cho phép
    // Nếu bị DENY nhưng chỉ ở 1 section, user vẫn có quyền ở section khác
    if (!denied) return true;

    // Bị DENY toàn hệ thống (section = null) → chặn
    if (denied.section === null) return false;

    // Bị DENY ở section cụ thể → check còn section nào khác có quyền không
    const deniedSections = await prisma.userPermission.findMany({
      where: {
        username,
        featureCode,
        action,
        decision: 'DENY',
        feature: { isActive: true, deletedAt: null },
      },
      select: { section: true },
    });
    const deniedSet = new Set(deniedSections.map((d) => d.section));

    // Còn section nào có role permission mà không bị DENY → cho phép
    const hasRemainingPermission = rolePermissions.some((rp) =>
      userRoles.some(
        (ur) =>
          ur.roleCode === rp.roleCode &&
          (rp.section === null || ur.section === null || rp.section === ur.section) &&
          !deniedSet.has(ur.section),
      ),
    );

    if (hasRemainingPermission) return true;
  }

  // 4. Check UserPermission ALLOW override
  const allowed = await prisma.userPermission.findFirst({
    where: {
      username,
      featureCode,
      action,
      decision: 'ALLOW',
      feature: { isActive: true, deletedAt: null },
    },
  });

  return !!allowed;
}
