export const ASSET_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  IN_USE: 'IN_USE',
  UNDER_REPAIR: 'UNDER_REPAIR',
  DISPOSED: 'DISPOSED',
  LOST: 'LOST',
} as const;

export type AssetStatus = (typeof ASSET_STATUSES)[keyof typeof ASSET_STATUSES];

export const MANAGE_TYPES = {
  INDIVIDUAL: 'Individual',
  BULK: 'Bulk',
} as const;

export type ManageType = (typeof MANAGE_TYPES)[keyof typeof MANAGE_TYPES];
