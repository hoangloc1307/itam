export interface AttributeGroupBase<TDate = string> {
  id: number;
  name: string;
  sortOrder: number;
  isActive: boolean;
  deletedAt: TDate | null;
  createdBy: string;
  createdAt: TDate;
  updatedBy: string | null;
  updatedAt: TDate | null;
}

/** FE type — dates as ISO strings */
export type AttributeGroup = AttributeGroupBase<string>;

/** BE type — dates as Date objects (from Prisma) */
export type AttributeGroupEntity = AttributeGroupBase<Date>;
