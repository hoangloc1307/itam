import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { authorize } from '~/middlewares/authorize';
import { modelAttributeValueController } from '~/modules/model-attribute-value/model-attribute-value.controller';

const router = Router();

router.get(
  '/:modelId',
  authorize(FEATURES.MODEL, 'READ'),
  modelAttributeValueController.getByModelId,
);
router.put('/:modelId', authorize(FEATURES.MODEL, 'UPDATE'), modelAttributeValueController.sync);

export default router;
