export interface UserRoleBase {
  id: number;
  username: string;
  roleCode: string;
  section: string | null;
}

/** FE type — same as base (no date fields) */
export type UserRole = UserRoleBase;

/** BE type — same as base (no date fields) */
export type UserRoleEntity = UserRoleBase;

/** Grouped roles for a user (used in list view) */
export interface UserRoleGroup {
  username: string;
  name: string;
  roles: UserRole[];
}
