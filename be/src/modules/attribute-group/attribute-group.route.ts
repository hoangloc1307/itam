import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import {
  createAttributeGroupSchema,
  updateAttributeGroupSchema,
} from 'itam-shared/schemas/attribute-group';
import { authorize } from '~/middlewares/authorize';
import { requestValidator } from '~/middlewares/request-validator';
import { attributeGroupController } from '~/modules/attribute-group/attribute-group.controller';

const router = Router();

router.get('/', authorize(FEATURES.ATTRIBUTE_GROUP, 'READ'), attributeGroupController.list);
router.get('/:id', authorize(FEATURES.ATTRIBUTE_GROUP, 'READ'), attributeGroupController.getById);
router.post(
  '/',
  authorize(FEATURES.ATTRIBUTE_GROUP, 'CREATE'),
  requestValidator(createAttributeGroupSchema),
  attributeGroupController.create,
);
router.put(
  '/:id',
  authorize(FEATURES.ATTRIBUTE_GROUP, 'UPDATE'),
  requestValidator(updateAttributeGroupSchema),
  attributeGroupController.update,
);
router.delete(
  '/:id',
  authorize(FEATURES.ATTRIBUTE_GROUP, 'DELETE'),
  attributeGroupController.remove,
);

export default router;
