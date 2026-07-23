import type { Request, Response } from 'express';
import { allocationService } from '~/modules/allocation/allocation.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || undefined;
  const employeeId = (req.query.employeeId as string) || undefined;
  const sectionId = (req.query.sectionId as string) || undefined;
  const assetId = (req.query.assetId as string) || undefined;
  const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : true;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

  const { data, totalItems } = await allocationService.list({
    search,
    employeeId,
    sectionId,
    assetId,
    isActive,
    page,
    limit,
  });

  ApiResponse.paginated(res, data, { page, limit, totalItems });
};

const getById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const allocation = await allocationService.getById(id);
  ApiResponse.ok(res, allocation);
};

const create = async (req: Request, res: Response) => {
  const allocation = await allocationService.create(req.body, req.user!.username);
  ApiResponse.created(res, allocation);
};

const returnAllocation = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const allocation = await allocationService.returnAllocation(id, req.body, req.user!.username);
  ApiResponse.ok(res, allocation);
};

const remove = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await allocationService.remove(id, req.user!.username);
  ApiResponse.deleted(res);
};

export const allocationController = { list, getById, create, returnAllocation, remove };
