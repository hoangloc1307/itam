import type { Request, Response } from 'express';
import type { AssetEntity } from 'itam-shared/types';
import { assetService } from '~/modules/asset/asset.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || undefined;
  const data = await assetService.list({ search });

  ApiResponse.ok<AssetEntity[]>(res, data);
};

const getById = async (req: Request, res: Response) => {
  const asset = await assetService.getById(req.params.id as string);
  ApiResponse.ok<AssetEntity>(res, asset);
};

const create = async (req: Request, res: Response) => {
  const asset = await assetService.create(req.body, req.user!.username);
  ApiResponse.created<AssetEntity>(res, asset);
};

const createBatch = async (req: Request, res: Response) => {
  const result = await assetService.createBatch(req.body, req.user!.username);
  ApiResponse.created(res, result);
};

const update = async (req: Request, res: Response) => {
  const asset = await assetService.update(req.params.id as string, req.body, req.user!.username);
  ApiResponse.ok<AssetEntity>(res, asset);
};

const remove = async (req: Request, res: Response) => {
  await assetService.remove(req.params.id as string);
  ApiResponse.deleted(res);
};

export const assetController = { list, getById, create, createBatch, update, remove };
