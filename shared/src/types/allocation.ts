export interface AllocationBase<TDate = string> {
  id: number;
  assetId: string;
  employeeId: string | null;
  sectionId: string | null;
  quantity: number;
  assignedDate: TDate;
  requestNo: string | null;
  note: string | null;
  isActive: boolean;
  createdBy: string;
  createdAt: TDate;
  updatedBy: string | null;
  updatedAt: TDate | null;
}

/** FE type - dates as ISO strings */
export type Allocation = AllocationBase<string>;

/** BE type - dates as Date objects */
export type AllocationEntity = AllocationBase<Date>;

/** Allocation with asset info for list view */
export interface AllocationDetail extends Allocation {
  asset: {
    id: string;
    name: string;
    assetCode: string | null;
    categoryId: string;
    categoryName: string;
    modelId: string | null;
    modelName: string | null;
    serialNumber: string | null;
  };
}
