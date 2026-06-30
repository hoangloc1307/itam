import type { Response } from 'express';
import { HTTP_STATUS, type HttpStatus } from '~/constants/http-status';

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export class ApiResponse {
  private static send<T>(
    res: Response,
    httpStatus: HttpStatus,
    success: boolean,
    message: string,
    data?: T | null,
    pagination?: Pagination,
  ) {
    return res.status(httpStatus).json({
      success,
      message,
      data: data ?? null,
      ...(pagination ? { pagination } : {}),
    });
  }

  static ok<T>(res: Response, data?: T, message = 'OK') {
    return ApiResponse.send(res, HTTP_STATUS.OK, true, message, data);
  }

  static created<T>(res: Response, data?: T, message = 'Created') {
    return ApiResponse.send(res, HTTP_STATUS.CREATED, true, message, data);
  }

  static deleted(res: Response) {
    return res.status(HTTP_STATUS.NO_CONTENT).end();
  }

  static paginated<T>(
    res: Response,
    data: T,
    pagination: { page: number; limit: number; totalItems: number },
    message = 'OK',
  ) {
    const totalPages = Math.ceil(pagination.totalItems / pagination.limit);

    return ApiResponse.send(res, HTTP_STATUS.OK, true, message, data, {
      ...pagination,
      totalPages,
    });
  }
}
