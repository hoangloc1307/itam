import type { Request, Response } from 'express';
import type { LoginResponse, ProfileResponse, RefreshResponse } from 'itam-shared/types';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { authService } from '~/modules/auth/auth.service';
import { ApiResponse } from '~/utils';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user, permissions } = await authService.login(req.body);

  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh',
  });

  ApiResponse.ok<LoginResponse>(res, { token: accessToken, user, permissions });
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string;

  if (!refreshToken) {
    throw AppError.unauthorized(t('auth:tokenExpired'));
  }

  const { accessToken, permissions } = await authService.refresh(refreshToken);

  ApiResponse.ok<RefreshResponse>(res, { token: accessToken, permissions });
};

const logout = (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/api/auth/refresh' });
  ApiResponse.ok(res, null, 'Logged out');
};

const register = async (req: Request, res: Response) => {
  await authService.register(req.body);
  ApiResponse.created(res, null, t('auth:registerSuccess'));
};

const getProfile = async (req: Request, res: Response) => {
  const username = req.user!.username;
  const profile = await authService.getProfile(username);
  ApiResponse.ok<ProfileResponse>(res, profile);
};

const changePassword = async (req: Request, res: Response) => {
  const username = req.user!.username;
  await authService.changePassword(username, req.body);
  ApiResponse.ok(res, null, t('auth:changePasswordSuccess'));
};

export const authController = { login, refresh, logout, register, getProfile, changePassword };
