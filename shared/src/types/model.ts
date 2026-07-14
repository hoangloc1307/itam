import type { ManageType } from 'itam-shared/constants';

export interface ModelBase<TDate = string> {
  id: string;
  categoryId: string;
  manufacturer: string | null;
  name: string;
  manageType: ManageType | null;
  modelCode: string | null;
  isActive: boolean;
  deletedAt: TDate | null;
  createdBy: string;
  createdAt: TDate;
  updatedBy: string | null;
  updatedAt: TDate | null;
}

/** FE type — dates as ISO strings (after JSON serialization) */
export type Model = ModelBase<string>;

/** BE type — dates as Date objects (from Prisma) */
export type ModelEntity = ModelBase<Date>;
