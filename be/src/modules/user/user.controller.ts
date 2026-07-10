import type { Request, Response } from 'express';
import type { UserEntity } from 'itam-shared/types';
import { t } from '~/i18n';
import { userService } from '~/modules/user/user.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const search = (req.query.search as string) || undefined;

  const { data, totalItems } = await userService.list({ page, limit, search });

  ApiResponse.paginated<UserEntity[]>(res, data, { page, limit, totalItems });
};

const getById = async (req: Request, res: Response) => {
  const user = await userService.getById(req.params.username as string);
  ApiResponse.ok<UserEntity>(res, user);
};

const create = async (req: Request, res: Response) => {
  const user = await userService.create(req.body, req.user!.username);
  ApiResponse.created<UserEntity>(res, user, t('user:createSuccess'));
};

const update = async (req: Request, res: Response) => {
  const user = await userService.update(
    req.params.username as string,
    req.body,
    req.user!.username,
  );
  ApiResponse.ok<UserEntity>(res, user, t('user:updateSuccess'));
};

const resetPassword = async (req: Request, res: Response) => {
  await userService.resetPassword(req.params.username as string);
  ApiResponse.ok(res, null, t('user:resetPasswordSuccess'));
};

export const userController = { list, getById, create, update, resetPassword };
