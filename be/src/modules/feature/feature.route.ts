import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { featureController } from '~/modules/feature/feature.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import { createFeatureSchema, updateFeatureSchema } from 'itam-shared/schemas/feature';

const router = Router();

router.get('/', authorize(FEATURES.FEATURE, 'READ'), featureController.list);
router.get('/:code', authorize(FEATURES.FEATURE, 'READ'), featureController.getByCode);
router.post(
  '/',
  authorize(FEATURES.FEATURE, 'CREATE'),
  requestValidator(createFeatureSchema),
  featureController.create,
);
router.put(
  '/:code',
  authorize(FEATURES.FEATURE, 'UPDATE'),
  requestValidator(updateFeatureSchema),
  featureController.update,
);
router.delete('/:code', authorize(FEATURES.FEATURE, 'DELETE'), featureController.remove);

export default router;
