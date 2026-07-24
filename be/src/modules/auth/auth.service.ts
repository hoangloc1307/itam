import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from 'itam-shared/schemas/auth';
import type { Permission } from 'itam-shared/types';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { prisma } from '~/lib/prisma';
import { mailService } from '~/services/mail.service';
import crypto from 'crypto';
import {
  generateAccessToken,
  generateRandomPassword,
  generateRefreshToken,
  hashPassword,
  verifyPassword,
  verifyRefreshToken,
} from '~/utils';

const resolvePermissions = async (username: string): Promise<Permission[]> => {
  const userRoles = await prisma.userRole.findMany({
    where: { username, role: { isActive: true, deletedAt: null } },
    select: { roleCode: true, section: true },
  });

  const roleCodes = [...new Set(userRoles.map((ur) => ur.roleCode))];
  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleCode: { in: roleCodes }, feature: { isActive: true, deletedAt: null } },
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
    where: { username, feature: { isActive: true, deletedAt: null } },
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
    user: { username: user.username, name: user.name ?? '', email: user.email ?? '' },
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

const getProfile = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { username: true, name: true, email: true },
  });

  if (!user) {
    throw AppError.notFound(t('auth:unauthorized'));
  }

  const userRoles = await prisma.userRole.findMany({
    where: { username, role: { isActive: true, deletedAt: null } },
    select: { roleCode: true, section: true, role: { select: { name: true } } },
  });

  const roles = userRoles.map((ur) => ({
    roleCode: ur.roleCode,
    roleName: ur.role.name,
    section: ur.section,
  }));

  return { username: user.username, name: user.name ?? '', email: user.email ?? '', roles };
};

const changePassword = async (username: string, data: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    throw AppError.notFound(t('auth:unauthorized'));
  }

  const isValid = await verifyPassword(user.password, data.currentPassword);

  if (!isValid) {
    throw AppError.badRequest(t('auth:currentPasswordIncorrect'));
  }

  const hashedPassword = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: { username },
    data: { password: hashedPassword, updatedBy: username, updatedAt: new Date() },
  });
};

const forgotPassword = async ({ username, email }: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !user.isActive || user.email !== email) {
    throw AppError.badRequest(t('auth:userNotFound'));
  }

  // Generate 6-digit OTP code
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Invalidate any existing unused codes for this user
  await prisma.passwordReset.updateMany({
    where: { username, usedAt: null },
    data: { usedAt: new Date() },
  });

  // Create new reset code
  await prisma.passwordReset.create({
    data: { username, code, expiresAt },
  });

  // Send email
  await mailService.sendEmail({
    to: email,
    subject: 'ITAM - Mã xác nhận đặt lại mật khẩu',
    template: 'forgot-password',
    data: { name: user.name ?? username, code },
  });
};

const resetPassword = async ({ username, code, newPassword }: ResetPasswordInput) => {
  const resetRecord = await prisma.passwordReset.findFirst({
    where: { username, code, usedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  if (!resetRecord || resetRecord.expiresAt < new Date()) {
    throw AppError.badRequest(t('auth:resetCodeInvalid'));
  }

  const hashedPw = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { username },
      data: { password: hashedPw, updatedBy: username, updatedAt: new Date() },
    }),
  ]);
};

export const authService = {
  login,
  refresh,
  register,
  getProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
