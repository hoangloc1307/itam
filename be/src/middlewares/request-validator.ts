import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '~/errors';
import { t } from '~/i18n';

export const requestValidator = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const translatedErrors = result.error.issues.map((issue) => ({
        path: issue.path,
        message: t(issue.message, { defaultValue: issue.message }),
      }));

      throw AppError.badRequest(t('common.validationFailed'), translatedErrors);
    }

    req.body = result.data;
    next();
  };
};
