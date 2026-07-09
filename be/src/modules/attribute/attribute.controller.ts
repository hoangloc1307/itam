import type { Request, Response } from 'express';
import type { AttributeEntity } from 'itam-shared/types';
import { attributeService } from '~/modules/attribute/attribute.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const search = (req.query.search as string) || undefined;

  const { data, totalItems } = await attributeService.list({ page, limit, search });

  ApiResponse.paginated(res, data as unknown as AttributeEntity[], { page, limit, totalItems });
};

const getById = async (req: Request, res: Response) => {
  const attribute = await attributeService.getById(Number(req.params.id));
  ApiResponse.ok(res, attribute as unknown as AttributeEntity);
};

const create = async (req: Request, res: Response) => {
  const attribute = await attributeService.create(req.body, req.user!.username);
  ApiResponse.created(res, attribute as unknown as AttributeEntity);
};

const update = async (req: Request, res: Response) => {
  const attribute = await attributeService.update(
    Number(req.params.id),
    req.body,
    req.user!.username,
  );
  ApiResponse.ok(res, attribute as unknown as AttributeEntity);
};

const remove = async (req: Request, res: Response) => {
  await attributeService.remove(Number(req.params.id));
  ApiResponse.deleted(res);
};

export const attributeController = { list, getById, create, update, remove };
