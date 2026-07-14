import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { modelController } from '~/modules/model/model.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import { createModelSchema, updateModelSchema } from 'itam-shared/schemas/model';

const router = Router();

router.get('/', authorize(FEATURES.MODEL, 'READ'), modelController.list);
router.get('/:id', authorize(FEATURES.MODEL, 'READ'), modelController.getById);
router.post(
  '/',
  authorize(FEATURES.MODEL, 'CREATE'),
  requestValidator(createModelSchema),
  modelController.create,
);
router.put(
  '/:id',
  authorize(FEATURES.MODEL, 'UPDATE'),
  requestValidator(updateModelSchema),
  modelController.update,
);
router.delete('/:id', authorize(FEATURES.MODEL, 'DELETE'), modelController.remove);

export default router;
