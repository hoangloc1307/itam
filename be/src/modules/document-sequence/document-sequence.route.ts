import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { documentSequenceController } from '~/modules/document-sequence/document-sequence.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import {
  createDocumentSequenceSchema,
  updateDocumentSequenceSchema,
} from 'itam-shared/schemas/document-sequence';

const router = Router();

router.get('/', authorize(FEATURES.DOCUMENT_SEQUENCE, 'READ'), documentSequenceController.list);
router.get(
  '/:id',
  authorize(FEATURES.DOCUMENT_SEQUENCE, 'READ'),
  documentSequenceController.getById,
);
router.post(
  '/',
  authorize(FEATURES.DOCUMENT_SEQUENCE, 'CREATE'),
  requestValidator(createDocumentSequenceSchema),
  documentSequenceController.create,
);
router.put(
  '/:id',
  authorize(FEATURES.DOCUMENT_SEQUENCE, 'UPDATE'),
  requestValidator(updateDocumentSequenceSchema),
  documentSequenceController.update,
);
router.delete(
  '/:id',
  authorize(FEATURES.DOCUMENT_SEQUENCE, 'DELETE'),
  documentSequenceController.remove,
);

// Generate next code (increments counter)
router.post(
  '/:code/generate',
  authorize(FEATURES.DOCUMENT_SEQUENCE, 'READ'),
  documentSequenceController.generateCode,
);

// Preview next code (does NOT increment counter)
router.get(
  '/:code/preview',
  authorize(FEATURES.DOCUMENT_SEQUENCE, 'READ'),
  documentSequenceController.previewCode,
);

export default router;
