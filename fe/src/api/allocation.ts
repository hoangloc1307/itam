import { ENDPOINTS } from 'itam-shared/constants';
import type { CreateAllocationInput, ReturnAllocationInput } from 'itam-shared/schemas/allocation';
import type { AllocationDetail, ApiResponse } from 'itam-shared/types';
import api from '~/lib/axios';

export interface AllocationListParams {
  page?: number;
  limit?: number;
  search?: string;
  employeeId?: string;
  sectionId?: string;
  assetId?: string;
  isActive?: boolean;
}

const list = async (params?: AllocationListParams) =>
  await api.get<ApiResponse<AllocationDetail[]>>(
    ENDPOINTS.ALLOCATIONS,
    params as unknown as Record<string, unknown>,
  );

const getById = async (id: number) =>
  await api.get<ApiResponse<AllocationDetail>>(`${ENDPOINTS.ALLOCATIONS}/${id}`);

const create = async (payload: CreateAllocationInput) =>
  await api.post<ApiResponse<AllocationDetail>>(ENDPOINTS.ALLOCATIONS, payload);

const returnAllocation = async (id: number, payload: ReturnAllocationInput) =>
  await api.patch<ApiResponse<AllocationDetail>>(`${ENDPOINTS.ALLOCATIONS}/${id}/return`, payload);

const remove = async (id: number) =>
  await api.delete<ApiResponse<null>>(`${ENDPOINTS.ALLOCATIONS}/${id}`);

export const allocationApi = { list, getById, create, returnAllocation, remove };
