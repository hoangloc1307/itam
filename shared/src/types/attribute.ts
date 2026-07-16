import type { AttributeDataType } from '../schemas/attribute';

export interface AttributeGroupInfo {
  id: number;
  name: string;
}

export interface AttributeBase<TDate = string> {
  id: number;
  groupId: number | null;
  name: string;
  measurementUnit: string | null;
  dataType: AttributeDataType;
  options: string[] | null;
  isActive: boolean;
  deletedAt: TDate | null;
  createdBy: string;
  createdAt: TDate;
  updatedBy: string | null;
  updatedAt: TDate | null;
  group?: AttributeGroupInfo | null;
}

/** FE type — dates as ISO strings */
export type Attribute = AttributeBase<string>;

/** BE type — dates as Date objects (from Prisma) */
export type AttributeEntity = AttributeBase<Date>;
