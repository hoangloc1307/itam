import type { Request, Response, NextFunction } from 'express';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { verifyAccessToken, type AccessTokenPayload } from '~/utils';

declare module 'express' {
  interface Request {
    user?: AccessTokenPayload;
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw AppError.unauthorized(t('auth:tokenMissing'));
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw AppError.unauthorized(t('auth:tokenInvalid'));
  }
};
