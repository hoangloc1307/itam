import type { Request, Response } from 'express';
import { ApiResponse } from '~/utils';
import { HTTP_STATUS } from '~/constants/http-status';

export const notFoundHandler = (_req: Request, res: Response) => {
  ApiResponse.error(res, 'Not found', HTTP_STATUS.NOT_FOUND);
};
