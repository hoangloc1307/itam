import type { Request, Response } from 'express';
import { categoryService } from '~/modules/category/category.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const search = (req.query.search as string) || undefined;

  const { data, totalItems } = await categoryService.list({ page, limit, search });

  ApiResponse.paginated(res, data, { page, limit, totalItems });
};

const getById = async (req: Request, res: Response) => {
  const category = await categoryService.getById(req.params.id);
  ApiResponse.ok(res, category);
};

const create = async (req: Request, res: Response) => {
  const category = await categoryService.create(req.body, req.user!.username);
  ApiResponse.created(res, category);
};

const update = async (req: Request, res: Response) => {
  const category = await categoryService.update(req.params.id, req.body, req.user!.username);
  ApiResponse.ok(res, category);
};

const remove = async (req: Request, res: Response) => {
  await categoryService.remove(req.params.id);
  ApiResponse.deleted(res);
};

export const categoryController = { list, getById, create, update, remove };
