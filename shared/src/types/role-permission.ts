import type { Action } from '../constants/actions';

export interface RolePermissionBase {
  id: number;
  roleCode: string;
  featureCode: string;
  action: Action;
  section: string | null;
}

/** FE type — same as base (no date fields) */
export type RolePermission = RolePermissionBase;

/** BE type — same as base (no date fields) */
export type RolePermissionEntity = RolePermissionBase;

/** Grouped permissions for a role (used in list view) */
export interface RolePermissionGroup {
  roleCode: string;
  roleName: string;
  permissions: RolePermission[];
}
