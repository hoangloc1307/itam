import type { Response } from 'express';
import { HTTP_STATUS, type HttpStatus } from '~/constants/http-status';

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface ApiResponseBody<T> {
  success: boolean;
  message: string;
  data?: T | null;
  pagination?: Pagination;
}

export class ApiResponse {
  static ok<T>(res: Response, data?: T, message = 'OK') {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data: data ?? null,
    } satisfies ApiResponseBody<T>);
  }

  static created<T>(res: Response, data?: T, message = 'Created') {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message,
      data: data ?? null,
    } satisfies ApiResponseBody<T>);
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

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems: pagination.totalItems,
        totalPages,
      },
    } satisfies ApiResponseBody<T>);
  }

  static error(
    res: Response,
    message: string,
    httpStatus: HttpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ) {
    return res.status(httpStatus).json({
      success: false,
      message,
    } satisfies ApiResponseBody<never>);
  }
}
