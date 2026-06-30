import type { Router } from 'express';
import authRouter from '~/modules/auth/auth.route';

interface ModuleConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const modulesConfig: ModuleConfig[] = [
  { path: '/auth', router: authRouter, isPublic: true },
];
