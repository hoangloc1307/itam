export const ACTIONS = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  MANAGE: 'MANAGE',
  APPROVAL: 'APPROVAL',
} as const;

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
