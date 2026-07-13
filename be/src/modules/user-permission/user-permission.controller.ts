import type { Request, Response } from 'express';
import type { UserPermissionEntity } from 'itam-shared/types';
import { userPermissionService } from '~/modules/user-permission/user-permission.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const username = (req.query.username as string) || undefined;
  const featureCode = (req.query.featureCode as string) || undefined;

  const { data, totalItems } = await userPermissionService.list({
    page,
    limit,
    username,
    featureCode,
  });

  ApiResponse.paginated<UserPermissionEntity[]>(res, data, { page, limit, totalItems });
};

const getByUsername = async (req: Request, res: Response) => {
  const result = await userPermissionService.getByUsername(req.params.username as string);
  ApiResponse.ok(res, result);
};

const create = async (req: Request, res: Response) => {
  const permission = await userPermissionService.create(req.body);
  ApiResponse.created<UserPermissionEntity>(res, permission);
};

const sync = async (req: Request, res: Response) => {
  const permissions = await userPermissionService.syncByUser(req.body);
  ApiResponse.ok<UserPermissionEntity[]>(res, permissions);
};

const update = async (req: Request, res: Response) => {
  const permission = await userPermissionService.update(Number(req.params.id), req.body);
  ApiResponse.ok<UserPermissionEntity>(res, permission);
};

const remove = async (req: Request, res: Response) => {
  await userPermissionService.remove(Number(req.params.id));
  ApiResponse.deleted(res);
};

export const userPermissionController = { list, getByUsername, create, update, sync, remove };
