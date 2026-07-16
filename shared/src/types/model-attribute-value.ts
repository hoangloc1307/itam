import type { AttributeDataType } from '../schemas/attribute';

export interface ModelAttributeValueItem {
  attributeId: number;
  name: string;
  measurementUnit: string | null;
  dataType: AttributeDataType;
  options: string[] | null;
  groupId: number | null;
  groupName: string | null;
  isRequired: boolean;
  value: string | null;
}

export interface SyncModelAttributeValuePayload {
  attributeId: number;
  value: string | null;
}
