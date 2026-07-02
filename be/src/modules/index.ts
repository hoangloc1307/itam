import type { Router } from 'express';
import authRouter from '~/modules/auth/auth.route';
import categoryRouter from '~/modules/category/category.route';

interface ModuleConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const modulesConfig: ModuleConfig[] = [
  { path: '/auth', router: authRouter, isPublic: true },
  { path: '/categories', router: categoryRouter },
];
