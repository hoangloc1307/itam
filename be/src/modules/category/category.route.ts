import { Router } from 'express';
import { categoryController } from '~/modules/category/category.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import { createCategorySchema, updateCategorySchema } from 'itam-shared/schemas/category';

const router = Router();

router.get('/', authorize('CATEGORY', 'READ'), categoryController.list);
router.get('/:id', authorize('CATEGORY', 'READ'), categoryController.getById);
router.post(
  '/',
  authorize('CATEGORY', 'CREATE'),
  requestValidator(createCategorySchema),
  categoryController.create,
);
router.put(
  '/:id',
  authorize('CATEGORY', 'UPDATE'),
  requestValidator(updateCategorySchema),
  categoryController.update,
);
router.delete('/:id', authorize('CATEGORY', 'DELETE'), categoryController.remove);

export default router;
