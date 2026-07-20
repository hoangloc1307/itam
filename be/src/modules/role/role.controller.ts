import type { Request, Response } from 'express';
import type { RoleEntity } from 'itam-shared/types';
import { roleService } from '~/modules/role/role.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || undefined;

  const data = await roleService.list({ search });

  ApiResponse.ok<RoleEntity[]>(res, data);
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
