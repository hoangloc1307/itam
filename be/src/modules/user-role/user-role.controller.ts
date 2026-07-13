import type { Request, Response } from 'express';
import type { UserRoleEntity } from 'itam-shared/types';
import { userRoleService } from '~/modules/user-role/user-role.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const username = (req.query.username as string) || undefined;
  const roleCode = (req.query.roleCode as string) || undefined;

  const { data, totalItems } = await userRoleService.list({
    page,
    limit,
    username,
    roleCode,
  });

  ApiResponse.paginated<UserRoleEntity[]>(res, data, { page, limit, totalItems });
};

const getByUsername = async (req: Request, res: Response) => {
  const result = await userRoleService.getByUsername(req.params.username as string);
  ApiResponse.ok(res, result);
};

const create = async (req: Request, res: Response) => {
  const userRole = await userRoleService.create(req.body);
  ApiResponse.created<UserRoleEntity>(res, userRole);
};

const sync = async (req: Request, res: Response) => {
  const userRoles = await userRoleService.syncByUser(req.body);
  ApiResponse.ok<UserRoleEntity[]>(res, userRoles);
};

const update = async (req: Request, res: Response) => {
  const userRole = await userRoleService.update(Number(req.params.id), req.body);
  ApiResponse.ok<UserRoleEntity>(res, userRole);
};

const remove = async (req: Request, res: Response) => {
  await userRoleService.remove(Number(req.params.id));
  ApiResponse.deleted(res);
};

export const userRoleController = { list, getByUsername, create, update, sync, remove };
