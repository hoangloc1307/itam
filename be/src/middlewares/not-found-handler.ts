import type { Request, Response, NextFunction } from 'express';
import { AppError } from '~/errors';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound());
};
