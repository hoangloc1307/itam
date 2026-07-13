import type { Action } from '../constants/actions';

export type Decision = 'ALLOW' | 'DENY';

export interface UserPermissionBase {
  id: number;
  username: string;
  featureCode: string;
  action: Action;
  decision: Decision;
  section: string | null;
}

/** FE type — same as base (no date fields) */
export type UserPermission = UserPermissionBase;

/** BE type — same as base (no date fields) */
export type UserPermissionEntity = UserPermissionBase;

/** Grouped permissions for a user (used in list view) */
export interface UserPermissionGroup {
  username: string;
  name: string;
  permissions: UserPermission[];
}
