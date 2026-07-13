import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { rolePermissionController } from '~/modules/role-permission/role-permission.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import {
  createRolePermissionSchema,
  syncRolePermissionsSchema,
  updateRolePermissionSchema,
} from 'itam-shared/schemas/role-permission';

const router = Router();

router.get('/', authorize(FEATURES.ROLE, 'READ'), rolePermissionController.list);
router.get('/:roleCode', authorize(FEATURES.ROLE, 'READ'), rolePermissionController.getByRoleCode);
router.post(
  '/',
  authorize(FEATURES.ROLE, 'CREATE'),
  requestValidator(createRolePermissionSchema),
  rolePermissionController.create,
);
router.put(
  '/sync',
  authorize(FEATURES.ROLE, 'UPDATE'),
  requestValidator(syncRolePermissionsSchema),
  rolePermissionController.sync,
);
router.put(
  '/:id',
  authorize(FEATURES.ROLE, 'UPDATE'),
  requestValidator(updateRolePermissionSchema),
  rolePermissionController.update,
);
router.delete('/:id', authorize(FEATURES.ROLE, 'DELETE'), rolePermissionController.remove);

export default router;
