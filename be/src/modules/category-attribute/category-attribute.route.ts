import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { authorize } from '~/middlewares/authorize';
import { categoryAttributeController } from '~/modules/category-attribute/category-attribute.controller';

const router = Router();

router.get(
  '/:categoryId',
  authorize(FEATURES.CATEGORY, 'READ'),
  categoryAttributeController.getByCategoryId,
);
router.put(
  '/:categoryId',
  authorize(FEATURES.CATEGORY, 'UPDATE'),
  categoryAttributeController.sync,
);

export default router;
