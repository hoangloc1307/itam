export interface CategoryBase<TDate = string> {
  id: string;
  name: string;
  serialKey: string;
  maintenanceIntervalHours: number | null;
  isActive: boolean;
  deletedAt: TDate | null;
  createdBy: string;
  createdAt: TDate;
  updatedBy: string | null;
  updatedAt: TDate | null;
}

/** FE type — dates as ISO strings (after JSON serialization) */
export type Category = CategoryBase<string>;

/** BE type — dates as Date objects (from Prisma) */
export type CategoryEntity = CategoryBase<Date>;
