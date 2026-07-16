import type { Router } from 'express';
import { ENDPOINTS } from 'itam-shared/constants';
import attributeGroupRouter from '~/modules/attribute-group/attribute-group.route';
import attributeRouter from '~/modules/attribute/attribute.route';
import authRouter from '~/modules/auth/auth.route';
import categoryAttributeRouter from '~/modules/category-attribute/category-attribute.route';
import categoryRouter from '~/modules/category/category.route';
import featureRouter from '~/modules/feature/feature.route';
import modelAttributeValueRouter from '~/modules/model-attribute-value/model-attribute-value.route';
import modelRouter from '~/modules/model/model.route';
import roleRouter from '~/modules/role/role.route';
import rolePermissionRouter from '~/modules/role-permission/role-permission.route';
import userPermissionRouter from '~/modules/user-permission/user-permission.route';
import userRoleRouter from '~/modules/user-role/user-role.route';
import userRouter from '~/modules/user/user.route';

interface ModuleConfig {
  path: string;
  router: Router;
  isPublic?: boolean;
}

export const modulesConfig: ModuleConfig[] = [
  { path: ENDPOINTS.ATTRIBUTE_GROUPS, router: attributeGroupRouter },
  { path: ENDPOINTS.ATTRIBUTES, router: attributeRouter },
  { path: ENDPOINTS.AUTH, router: authRouter, isPublic: true },
  { path: ENDPOINTS.CATEGORY_ATTRIBUTES, router: categoryAttributeRouter },
  { path: ENDPOINTS.CATEGORIES, router: categoryRouter },
  { path: ENDPOINTS.FEATURES, router: featureRouter },
  { path: ENDPOINTS.MODEL_ATTRIBUTE_VALUES, router: modelAttributeValueRouter },
  { path: ENDPOINTS.MODELS, router: modelRouter },
  { path: ENDPOINTS.ROLES, router: roleRouter },
  { path: ENDPOINTS.ROLE_PERMISSIONS, router: rolePermissionRouter },
  { path: ENDPOINTS.USER_PERMISSIONS, router: userPermissionRouter },
  { path: ENDPOINTS.USER_ROLES, router: userRoleRouter },
  { path: ENDPOINTS.USERS, router: userRouter },
];
