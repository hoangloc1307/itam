import type { Request, Response } from 'express';
import type { CategoryAttributeItem } from 'itam-shared/types';
import { categoryAttributeService } from '~/modules/category-attribute/category-attribute.service';
import { ApiResponse } from '~/utils';

const getByCategoryId = async (req: Request, res: Response) => {
  const data = await categoryAttributeService.getByCategoryId(req.params.categoryId as string);
  ApiResponse.ok<CategoryAttributeItem[]>(res, data);
};

const sync = async (req: Request, res: Response) => {
  const data = await categoryAttributeService.sync(
    req.params.categoryId as string,
    req.body.attributes,
    req.user!.username,
  );
  ApiResponse.ok<CategoryAttributeItem[]>(res, data);
};

export const categoryAttributeController = { getByCategoryId, sync };
