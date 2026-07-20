import type { Request, Response } from 'express';
import type { FeatureEntity } from 'itam-shared/types';
import { featureService } from '~/modules/feature/feature.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || undefined;

  const data = await featureService.list({ search });

  ApiResponse.ok<FeatureEntity[]>(res, data);
};

const getByCode = async (req: Request, res: Response) => {
  const feature = await featureService.getByCode(req.params.code as string);
  ApiResponse.ok<FeatureEntity>(res, feature);
};

const create = async (req: Request, res: Response) => {
  const feature = await featureService.create(req.body, req.user!.username);
  ApiResponse.created<FeatureEntity>(res, feature);
};

const update = async (req: Request, res: Response) => {
  const feature = await featureService.update(
    req.params.code as string,
    req.body,
    req.user!.username,
  );
  ApiResponse.ok<FeatureEntity>(res, feature);
};

const remove = async (req: Request, res: Response) => {
  await featureService.remove(req.params.code as string);
  ApiResponse.deleted(res);
};

export const featureController = { list, getByCode, create, update, remove };
