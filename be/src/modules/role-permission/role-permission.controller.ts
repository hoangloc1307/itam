import type { Request, Response } from 'express';
import type { RolePermissionEntity } from 'itam-shared/types';
import { rolePermissionService } from '~/modules/role-permission/role-permission.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const roleCode = (req.query.roleCode as string) || undefined;
  const featureCode = (req.query.featureCode as string) || undefined;

  const data = await rolePermissionService.list({ roleCode, featureCode });

  ApiResponse.ok<RolePermissionEntity[]>(res, data);
};

const getByRoleCode = async (req: Request, res: Response) => {
  const result = await rolePermissionService.getByRoleCode(req.params.roleCode as string);
  ApiResponse.ok(res, result);
};

const create = async (req: Request, res: Response) => {
  const permission = await rolePermissionService.create(req.body);
  ApiResponse.created<RolePermissionEntity>(res, permission);
};

const sync = async (req: Request, res: Response) => {
  const permissions = await rolePermissionService.syncByRole(req.body);
  ApiResponse.ok<RolePermissionEntity[]>(res, permissions);
};

const update = async (req: Request, res: Response) => {
  const permission = await rolePermissionService.update(Number(req.params.id), req.body);
  ApiResponse.ok<RolePermissionEntity>(res, permission);
};

const remove = async (req: Request, res: Response) => {
  await rolePermissionService.remove(Number(req.params.id));
  ApiResponse.deleted(res);
};

export const rolePermissionController = { list, getByRoleCode, create, update, sync, remove };
