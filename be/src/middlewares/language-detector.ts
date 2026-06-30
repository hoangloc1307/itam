import type { Request, Response, NextFunction } from 'express';
import { changeLanguage, SUPPORTED_LANGUAGES } from '~/i18n';

const DEFAULT_LANGUAGE = 'vi';

export const languageDetector = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers['accept-language'] || '';
  const preferred = header.split(',')[0]?.trim().substring(0, 2).toLowerCase();
  const lang = SUPPORTED_LANGUAGES.includes(preferred) ? preferred : DEFAULT_LANGUAGE;

  changeLanguage(lang);
  next();
};
