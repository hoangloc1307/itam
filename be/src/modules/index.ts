import type { Router } from 'express';
import { ENDPOINTS } from 'itam-shared/constants';
import authRouter from '~/modules/auth/auth.route';
import categoryRouter from '~/modules/category/category.route';

interface ModuleConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const modulesConfig: ModuleConfig[] = [
  { path: ENDPOINTS.AUTH, router: authRouter, isPublic: true },
  { path: ENDPOINTS.CATEGORIES, router: categoryRouter },
];
