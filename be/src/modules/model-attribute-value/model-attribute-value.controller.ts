import type { Request, Response } from 'express';
import type { ModelAttributeValueItem } from 'itam-shared/types';
import { modelAttributeValueService } from '~/modules/model-attribute-value/model-attribute-value.service';
import { ApiResponse } from '~/utils';

const getByModelId = async (req: Request, res: Response) => {
  const data = await modelAttributeValueService.getByModelId(req.params.modelId as string);
  ApiResponse.ok<ModelAttributeValueItem[]>(res, data);
};

const sync = async (req: Request, res: Response) => {
  const values = req.body.values ?? [];
  const data = await modelAttributeValueService.sync(req.params.modelId as string, values);
  ApiResponse.ok<ModelAttributeValueItem[]>(res, data);
};

export const modelAttributeValueController = { getByModelId, sync };
