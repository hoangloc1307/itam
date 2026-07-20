import type { Request, Response } from 'express';
import { modelService } from '~/modules/model/model.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || undefined;
  const categoryId = (req.query.categoryId as string) || undefined;

  const data = await modelService.list({ search, categoryId });

  ApiResponse.ok(res, data);
};

const getById = async (req: Request, res: Response) => {
  const model = await modelService.getById(req.params.id as string);
  ApiResponse.ok(res, model);
};

const create = async (req: Request, res: Response) => {
  const model = await modelService.create(req.body, req.user!.username);
  ApiResponse.created(res, model);
};

const update = async (req: Request, res: Response) => {
  const model = await modelService.update(req.params.id as string, req.body, req.user!.username);
  ApiResponse.ok(res, model);
};

const remove = async (req: Request, res: Response) => {
  await modelService.remove(req.params.id as string);
  ApiResponse.deleted(res);
};

export const modelController = { list, getById, create, update, remove };
