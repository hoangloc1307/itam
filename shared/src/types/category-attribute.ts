import type { AttributeDataType } from '../schemas/attribute';

export interface CategoryAttributeItem {
  attributeId: number;
  name: string;
  measurementUnit: string | null;
  dataType: AttributeDataType;
  options: string[] | null;
  sortOrder: number;
  isRequired: boolean;
}

export interface SyncAttributePayload {
  attributeId: number;
  sortOrder: number;
  isRequired: boolean;
}
