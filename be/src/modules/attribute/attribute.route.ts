import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { createAttributeSchema, updateAttributeSchema } from 'itam-shared/schemas/attribute';
import { authorize } from '~/middlewares/authorize';
import { requestValidator } from '~/middlewares/request-validator';
import { attributeController } from '~/modules/attribute/attribute.controller';

const router = Router();

router.get('/', authorize(FEATURES.ATTRIBUTE, 'READ'), attributeController.list);
router.get('/:id', authorize(FEATURES.ATTRIBUTE, 'READ'), attributeController.getById);
router.post(
  '/',
  authorize(FEATURES.ATTRIBUTE, 'CREATE'),
  requestValidator(createAttributeSchema),
  attributeController.create,
);
router.put(
  '/:id',
  authorize(FEATURES.ATTRIBUTE, 'UPDATE'),
  requestValidator(updateAttributeSchema),
  attributeController.update,
);
router.delete('/:id', authorize(FEATURES.ATTRIBUTE, 'DELETE'), attributeController.remove);

export default router;
