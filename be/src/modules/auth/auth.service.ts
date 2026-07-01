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

  return {
    accessToken,
    refreshToken,
    user: { username: user.username, name: user.name, email: user.email },
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

  return { accessToken };
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
