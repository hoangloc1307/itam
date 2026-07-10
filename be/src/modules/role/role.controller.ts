import type { Request, Response } from 'express';
import type { RoleEntity } from 'itam-shared/types';
import { roleService } from '~/modules/role/role.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const search = (req.query.search as string) || undefined;

  const { data, totalItems } = await roleService.list({ page, limit, search });

  ApiResponse.paginated<RoleEntity[]>(res, data, { page, limit, totalItems });
};

const getByCode = async (req: Request, res: Response) => {
  const role = await roleService.getByCode(req.params.code as string);
  ApiResponse.ok<RoleEntity>(res, role);
};

const create = async (req: Request, res: Response) => {
  const role = await roleService.create(req.body, req.user!.username);
  ApiResponse.created<RoleEntity>(res, role);
};

const update = async (req: Request, res: Response) => {
  const role = await roleService.update(req.params.code as string, req.body, req.user!.username);
  ApiResponse.ok<RoleEntity>(res, role);
};

const remove = async (req: Request, res: Response) => {
  await roleService.remove(req.params.code as string);
  ApiResponse.deleted(res);
};

export const roleController = { list, getByCode, create, update, remove };
