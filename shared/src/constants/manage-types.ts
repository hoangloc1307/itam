export const MANAGE_TYPES = {
  INDIVIDUAL: 'Individual',
  BULK: 'Bulk',
} as const;

export type ManageType = (typeof MANAGE_TYPES)[keyof typeof MANAGE_TYPES];
