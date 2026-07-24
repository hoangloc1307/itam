import type { Action } from '../constants/actions';

export interface UserInfo {
  username: string;
  name: string;
  email: string;
}

export interface ProfileRole {
  roleCode: string;
  roleName: string;
  section: string | null;
}

export interface ProfileResponse {
  username: string;
  name: string;
  email: string;
  roles: ProfileRole[];
}

export interface Permission {
  featureCode: string;
  action: Action;
  section: string | null;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
  permissions: Permission[];
}

export interface RefreshResponse {
  token: string;
  permissions: Permission[];
}
