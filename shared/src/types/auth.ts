export interface UserInfo {
  username: string;
  name: string;
  email: string;
}

export interface Permission {
  featureCode: string;
  action: string;
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
