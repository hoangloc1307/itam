import type { Request, Response } from 'express';
import type { DocumentSequenceEntity, GenerateCodeResponse } from 'itam-shared/types';
import { documentSequenceService } from '~/modules/document-sequence/document-sequence.service';
import { ApiResponse } from '~/utils';

const list = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || undefined;
  const data = await documentSequenceService.list({ search });

  ApiResponse.ok<DocumentSequenceEntity[]>(res, data);
};

const getById = async (req: Request, res: Response) => {
  const data = await documentSequenceService.getById(Number(req.params.id));
  ApiResponse.ok<DocumentSequenceEntity>(res, data);
};

const create = async (req: Request, res: Response) => {
  const data = await documentSequenceService.create(req.body, req.user!.username);
  ApiResponse.created<DocumentSequenceEntity>(res, data);
};

const update = async (req: Request, res: Response) => {
  const data = await documentSequenceService.update(
    Number(req.params.id),
    req.body,
    req.user!.username,
  );
  ApiResponse.ok<DocumentSequenceEntity>(res, data);
};

const remove = async (req: Request, res: Response) => {
  await documentSequenceService.remove(Number(req.params.id));
  ApiResponse.deleted(res);
};

const generateCode = async (req: Request, res: Response) => {
  const data = await documentSequenceService.generateCode(req.params.code as string);
  ApiResponse.ok<GenerateCodeResponse>(res, data);
};

const previewCode = async (req: Request, res: Response) => {
  const data = await documentSequenceService.previewCode(req.params.code as string);
  ApiResponse.ok<GenerateCodeResponse>(res, data);
};

export const documentSequenceController = {
  list,
  getById,
  create,
  update,
  remove,
  generateCode,
  previewCode,
};
