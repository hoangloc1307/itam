import { ENDPOINTS } from 'itam-shared/constants';
import type {
  CreateDocumentSequenceInput,
  UpdateDocumentSequenceInput,
} from 'itam-shared/schemas/document-sequence';
import type { ApiResponse, DocumentSequence, GenerateCodeResponse } from 'itam-shared/types';
import api from '~/lib/axios';

const list = async (params?: { search?: string }) =>
  await api.get<ApiResponse<DocumentSequence[]>>(ENDPOINTS.DOCUMENT_SEQUENCES, params);

const getById = async (id: number) =>
  await api.get<ApiResponse<DocumentSequence>>(`${ENDPOINTS.DOCUMENT_SEQUENCES}/${id}`);

const create = async (payload: CreateDocumentSequenceInput) =>
  await api.post<ApiResponse<DocumentSequence>>(ENDPOINTS.DOCUMENT_SEQUENCES, payload);

const update = async (id: number, payload: UpdateDocumentSequenceInput) =>
  await api.put<ApiResponse<DocumentSequence>>(`${ENDPOINTS.DOCUMENT_SEQUENCES}/${id}`, payload);

const remove = async (id: number) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.DOCUMENT_SEQUENCES}/${id}`);

const preview = async (code: string) =>
  await api.get<ApiResponse<GenerateCodeResponse>>(
    `${ENDPOINTS.DOCUMENT_SEQUENCES}/${code}/preview`,
  );

export const documentSequenceApi = { list, getById, create, update, remove, preview };
