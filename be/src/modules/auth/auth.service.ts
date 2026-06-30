import type { LoginInput } from 'itam-shared/schemas/auth';
import { prisma } from '~/lib/prisma';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyPassword,
} from '~/utils';

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
  const payload = verifyRefreshToken(refreshToken);

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

export const authService = { login, refresh };
