import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { roleController } from '~/modules/role/role.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import { createRoleSchema, updateRoleSchema } from 'itam-shared/schemas/role';

const router = Router();

router.get('/', authorize(FEATURES.ROLE, 'READ'), roleController.list);
router.get('/:code', authorize(FEATURES.ROLE, 'READ'), roleController.getByCode);
router.post(
  '/',
  authorize(FEATURES.ROLE, 'CREATE'),
  requestValidator(createRoleSchema),
  roleController.create,
);
router.put(
  '/:code',
  authorize(FEATURES.ROLE, 'UPDATE'),
  requestValidator(updateRoleSchema),
  roleController.update,
);
router.delete('/:code', authorize(FEATURES.ROLE, 'DELETE'), roleController.remove);

export default router;
