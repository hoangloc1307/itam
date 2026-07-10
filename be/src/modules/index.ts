import type { Router } from 'express';
import { ENDPOINTS } from 'itam-shared/constants';
import attributeRouter from '~/modules/attribute/attribute.route';
import authRouter from '~/modules/auth/auth.route';
import categoryAttributeRouter from '~/modules/category-attribute/category-attribute.route';
import categoryRouter from '~/modules/category/category.route';
import roleRouter from '~/modules/role/role.route';
import userRouter from '~/modules/user/user.route';

interface ModuleConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const modulesConfig: ModuleConfig[] = [
  { path: ENDPOINTS.ATTRIBUTES, router: attributeRouter },
  { path: ENDPOINTS.AUTH, router: authRouter, isPublic: true },
  { path: ENDPOINTS.CATEGORY_ATTRIBUTES, router: categoryAttributeRouter },
  { path: ENDPOINTS.CATEGORIES, router: categoryRouter },
  { path: ENDPOINTS.ROLES, router: roleRouter },
  { path: ENDPOINTS.USERS, router: userRouter },
];
