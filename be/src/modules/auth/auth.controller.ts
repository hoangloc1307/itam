import type { Request, Response } from 'express';
import { authService } from '~/modules/auth/auth.service';
import { ApiResponse } from '~/utils';
import { AppError } from '~/errors';
import { t } from '~/i18n';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await authService.login(req.body);

  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh',
  });

  ApiResponse.ok(res, { token: accessToken, user });
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string;

  if (!refreshToken) {
    throw AppError.unauthorized(t('auth:tokenExpired'));
  }

  const { accessToken } = await authService.refresh(refreshToken);

  ApiResponse.ok(res, { token: accessToken });
};

const logout = (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/api/auth/refresh' });
  ApiResponse.ok(res, null, 'Logged out');
};

export const authController = { login, refresh, logout };
