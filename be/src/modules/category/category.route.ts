import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { categoryController } from '~/modules/category/category.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import { createCategorySchema, updateCategorySchema } from 'itam-shared/schemas/category';

const router = Router();

router.get('/', authorize(FEATURES.CATEGORY, 'READ'), categoryController.list);
router.get('/:id', authorize(FEATURES.CATEGORY, 'READ'), categoryController.getById);
router.post(
  '/',
  authorize(FEATURES.CATEGORY, 'CREATE'),
  requestValidator(createCategorySchema),
  categoryController.create,
);
router.put(
  '/:id',
  authorize(FEATURES.CATEGORY, 'UPDATE'),
  requestValidator(updateCategorySchema),
  categoryController.update,
);
router.delete('/:id', authorize(FEATURES.CATEGORY, 'DELETE'), categoryController.remove);

export default router;
