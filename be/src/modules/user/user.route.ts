import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { createUserSchema, updateUserSchema } from 'itam-shared/schemas/user';
import { authorize } from '~/middlewares/authorize';
import { requestValidator } from '~/middlewares/request-validator';
import { userController } from '~/modules/user/user.controller';

const router = Router();

router.get('/', authorize(FEATURES.USER, 'READ'), userController.list);
router.get('/:username', authorize(FEATURES.USER, 'READ'), userController.getById);
router.post(
  '/',
  authorize(FEATURES.USER, 'CREATE'),
  requestValidator(createUserSchema),
  userController.create,
);
router.put(
  '/:username',
  authorize(FEATURES.USER, 'UPDATE'),
  requestValidator(updateUserSchema),
  userController.update,
);
router.post(
  '/:username/reset-password',
  authorize(FEATURES.USER, 'UPDATE'),
  userController.resetPassword,
);
router.delete('/:username', authorize(FEATURES.USER, 'DELETE'), userController.remove);

export default router;
