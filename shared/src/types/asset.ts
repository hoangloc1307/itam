import type { AssetStatus } from '../constants/asset';

export type { AssetStatus };

export interface AssetAttributeValueItem {
  attributeId: number;
  name: string;
  measurementUnit: string | null;
  dataType: string;
  options: string[] | null;
  groupId: number | null;
  groupName: string | null;
  isRequired: boolean;
  value: string | null;
}

export interface AssetBase<TDate = string, TDecimal = string> {
  id: string;
  assetCode: string | null;
  name: string;
  categoryId: string;
  modelId: string | null;
  vendorId: string | null;
  purchaseDate: TDate | null;
  purchasePrice: TDecimal | null;
  warrantyStartDate: TDate | null;
  warrantyEndDate: TDate | null;
  warrantyMonth: number | null;
  serialNumber: string | null;
  location: string | null;
  maintenanceIntervalHours: number | null;
  lastMaintenanceDate: TDate | null;
  quantity: number;
  remainQuantity: number;
  qrCode: string | null;
  assetStatus: AssetStatus;
  deletedAt: TDate | null;
  createdBy: string;
  createdAt: TDate;
  updatedBy: string | null;
  updatedAt: TDate | null;
}

/** FE type — dates as ISO strings, Decimal as string (after JSON serialization) */
export type Asset = AssetBase<string, string>;

/** BE type — dates as Date objects, Decimal from Prisma */
export type AssetEntity = AssetBase<Date, unknown>;

/** Asset with attribute values for detail view */
export interface AssetDetail extends Asset {
  attributeValues: AssetAttributeValueItem[];
}
