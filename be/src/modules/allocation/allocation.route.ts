import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { allocationController } from '~/modules/allocation/allocation.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import { createAllocationSchema, returnAllocationSchema } from 'itam-shared/schemas/allocation';

const router = Router();

router.get('/', authorize(FEATURES.ALLOCATION, 'READ'), allocationController.list);
router.get('/:id', authorize(FEATURES.ALLOCATION, 'READ'), allocationController.getById);
router.post(
  '/',
  authorize(FEATURES.ALLOCATION, 'CREATE'),
  requestValidator(createAllocationSchema),
  allocationController.create,
);
router.patch(
  '/:id/return',
  authorize(FEATURES.ALLOCATION, 'UPDATE'),
  requestValidator(returnAllocationSchema),
  allocationController.returnAllocation,
);
router.delete('/:id', authorize(FEATURES.ALLOCATION, 'DELETE'), allocationController.remove);

export default router;
