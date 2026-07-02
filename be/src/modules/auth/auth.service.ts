import type { LoginInput, RegisterInput } from 'itam-shared/schemas/auth';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import {
  generateAccessToken,
  generateRandomPassword,
  generateRefreshToken,
  verifyRefreshToken,
  verifyPassword,
  hashPassword,
} from '~/utils';
import { mailService } from '~/services/mail.service';

export interface Permission {
  featureCode: string;
  action: string;
  section: string | null;
}

const resolvePermissions = async (username: string): Promise<Permission[]> => {
  const userRoles = await prisma.userRole.findMany({
    where: { username },
    select: { roleCode: true, section: true },
  });

  const roleCodes = [...new Set(userRoles.map((ur) => ur.roleCode))];
  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleCode: { in: roleCodes } },
    select: { featureCode: true, action: true, roleCode: true, section: true },
  });

  const permissionSet = new Map<string, Permission>();

  for (const rp of rolePermissions) {
    const matchingUserRoles = userRoles.filter((ur) => ur.roleCode === rp.roleCode);

    for (const ur of matchingUserRoles) {
      if (rp.section !== null && ur.section !== null && rp.section !== ur.section) {
        continue;
      }

      const effectiveSection = rp.section ?? ur.section;
      const key = `${rp.featureCode}:${rp.action}:${effectiveSection ?? '*'}`;
      permissionSet.set(key, {
        featureCode: rp.featureCode,
        action: rp.action,
        section: effectiveSection,
      });
    }
  }

  const userPermissions = await prisma.userPermission.findMany({
    where: { username },
    select: { featureCode: true, action: true, decision: true, section: true },
  });

  for (const up of userPermissions) {
    const key = `${up.featureCode}:${up.action}:${up.section ?? '*'}`;
    if (up.decision === 'ALLOW') {
      permissionSet.set(key, {
        featureCode: up.featureCode,
        action: up.action,
        section: up.section,
      });
    } else {
      permissionSet.delete(key);
    }
  }

  return Array.from(permissionSet.values());
};

const login = async ({ username, password }: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized(t('auth:invalidCredentials'));
  }

  const isPasswordValid = await verifyPassword(user.password, password);

  if (!isPasswordValid) {
    throw AppError.unauthorized(t('auth:invalidCredentials'));
  }

  const accessToken = generateAccessToken({ username: user.username });
  const refreshToken = generateRefreshToken({ username: user.username });
  const permissions = await resolvePermissions(user.username);

  return {
    accessToken,
    refreshToken,
    user: { username: user.username, name: user.name, email: user.email },
    permissions,
  };
};

const refresh = async (refreshToken: string) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw AppError.unauthorized(t('auth:tokenExpired'));
  }

  if (!payload.username) {
    throw AppError.unauthorized(t('auth:tokenExpired'));
  }

  const user = await prisma.user.findUnique({
    where: { username: payload.username },
  });

  if (!user || !user.isActive) {
    throw AppError.unauthorized(t('auth:unauthorized'));
  }

  const accessToken = generateAccessToken({ username: user.username });
  const permissions = await resolvePermissions(user.username);

  return { accessToken, permissions };
};

const register = async ({ username, email, name }: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { username } });

  if (existing) {
    throw AppError.conflict(t('auth:usernameExists'));
  }

  const plainPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(plainPassword);

  await prisma.user.create({
    data: {
      username,
      email,
      name,
      password: hashedPassword,
      createdBy: username,
    },
  });

  await mailService.sendEmail({
    to: email,
    subject: 'ITAM - Tài khoản của bạn đã được tạo',
    template: 'account-created',
    data: { name, username, password: plainPassword },
  });
};

export const authService = { login, refresh, register };
