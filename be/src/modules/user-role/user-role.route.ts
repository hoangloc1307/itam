import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { userRoleController } from '~/modules/user-role/user-role.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import {
  createUserRoleSchema,
  syncUserRolesSchema,
  updateUserRoleSchema,
} from 'itam-shared/schemas/user-role';

const router = Router();

router.get('/', authorize(FEATURES.USER, 'READ'), userRoleController.list);
router.get('/:username', authorize(FEATURES.USER, 'READ'), userRoleController.getByUsername);
router.post(
  '/',
  authorize(FEATURES.USER, 'CREATE'),
  requestValidator(createUserRoleSchema),
  userRoleController.create,
);
router.put(
  '/sync',
  authorize(FEATURES.USER, 'UPDATE'),
  requestValidator(syncUserRolesSchema),
  userRoleController.sync,
);
router.put(
  '/:id',
  authorize(FEATURES.USER, 'UPDATE'),
  requestValidator(updateUserRoleSchema),
  userRoleController.update,
);
router.delete('/:id', authorize(FEATURES.USER, 'DELETE'), userRoleController.remove);

export default router;
