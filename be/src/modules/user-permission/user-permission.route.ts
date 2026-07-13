import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { userPermissionController } from '~/modules/user-permission/user-permission.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import {
  createUserPermissionSchema,
  syncUserPermissionsSchema,
  updateUserPermissionSchema,
} from 'itam-shared/schemas/user-permission';

const router = Router();

router.get('/', authorize(FEATURES.USER, 'READ'), userPermissionController.list);
router.get('/:username', authorize(FEATURES.USER, 'READ'), userPermissionController.getByUsername);
router.post(
  '/',
  authorize(FEATURES.USER, 'CREATE'),
  requestValidator(createUserPermissionSchema),
  userPermissionController.create,
);
router.put(
  '/sync',
  authorize(FEATURES.USER, 'UPDATE'),
  requestValidator(syncUserPermissionsSchema),
  userPermissionController.sync,
);
router.put(
  '/:id',
  authorize(FEATURES.USER, 'UPDATE'),
  requestValidator(updateUserPermissionSchema),
  userPermissionController.update,
);
router.delete('/:id', authorize(FEATURES.USER, 'DELETE'), userPermissionController.remove);

export default router;
