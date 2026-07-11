export interface FeatureBase<TDate = string> {
  code: string;
  name: string;
  isActive: boolean;
  deletedAt: TDate | null;
  createdBy: string;
  createdAt: TDate;
  updatedBy: string | null;
  updatedAt: TDate | null;
}

/** FE type — dates as ISO strings (after JSON serialization) */
export type Feature = FeatureBase<string>;

/** BE type — dates as Date objects (from Prisma) */
export type FeatureEntity = FeatureBase<Date>;
