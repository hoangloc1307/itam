import type { Request, Response } from 'express';
import type { AttributeGroupEntity } from 'itam-shared/types';
import { attributeGroupService } from '~/modules/attribute-group/attribute-group.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || undefined;

  const data = await attributeGroupService.list({ search });

  ApiResponse.ok(res, data as unknown as AttributeGroupEntity[]);
};

const getById = async (req: Request, res: Response) => {
  const group = await attributeGroupService.getById(Number(req.params.id));
  ApiResponse.ok(res, group as unknown as AttributeGroupEntity);
};

const create = async (req: Request, res: Response) => {
  const group = await attributeGroupService.create(req.body, req.user!.username);
  ApiResponse.created(res, group as unknown as AttributeGroupEntity);
};

const update = async (req: Request, res: Response) => {
  const group = await attributeGroupService.update(
    Number(req.params.id),
    req.body,
    req.user!.username,
  );
  ApiResponse.ok(res, group as unknown as AttributeGroupEntity);
};

const remove = async (req: Request, res: Response) => {
  await attributeGroupService.remove(Number(req.params.id));
  ApiResponse.deleted(res);
};

export const attributeGroupController = { list, getById, create, update, remove };
