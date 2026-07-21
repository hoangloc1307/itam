export const ASSET_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  IN_USE: 'IN_USE',
  UNDER_REPAIR: 'UNDER_REPAIR',
  DISPOSED: 'DISPOSED',
  LOST: 'LOST',
} as const;

export type AssetStatus = (typeof ASSET_STATUSES)[keyof typeof ASSET_STATUSES];
