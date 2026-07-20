import { Router } from 'express';
import { FEATURES } from 'itam-shared/constants';
import { assetController } from '~/modules/asset/asset.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authorize } from '~/middlewares/authorize';
import {
  createAssetSchema,
  createBatchAssetSchema,
  updateAssetSchema,
} from 'itam-shared/schemas/asset';

const router = Router();

router.get('/', authorize(FEATURES.ASSET, 'READ'), assetController.list);
router.get('/:id', authorize(FEATURES.ASSET, 'READ'), assetController.getById);
router.post(
  '/',
  authorize(FEATURES.ASSET, 'CREATE'),
  requestValidator(createAssetSchema),
  assetController.create,
);
router.post(
  '/batch',
  authorize(FEATURES.ASSET, 'CREATE'),
  requestValidator(createBatchAssetSchema),
  assetController.createBatch,
);
router.put(
  '/:id',
  authorize(FEATURES.ASSET, 'UPDATE'),
  requestValidator(updateAssetSchema),
  assetController.update,
);
router.delete('/:id', authorize(FEATURES.ASSET, 'DELETE'), assetController.remove);

export default router;
