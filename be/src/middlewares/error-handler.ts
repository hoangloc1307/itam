import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '~/constants/http-status';
import { AppError } from '~/errors';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.httpStatusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      ...(err.metadata ? { metadata: err.metadata } : {}),
    });
    return;
  }

  // Unexpected error
  console.error('Unhandled error:', err);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
    errorCode: 'INTERNAL_SERVER_ERROR',
  });
};
