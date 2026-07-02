import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import STORAGE_KEYS from '~/constants/storage-keys';

interface User {
  username: string;
  name: string;
  email: string;
}

export interface Permission {
  featureCode: string;
  action: string;
  section: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  permissions: Permission[];
  setAuth: (data: { token: string; user: User; permissions: Permission[] }) => void;
  setToken: (token: string) => void;
  setPermissions: (permissions: Permission[]) => void;
  logout: () => void;
  hasPermission: (featureCode: string, action?: string, section?: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      permissions: [],
      setAuth: ({ token, user, permissions }) => set({ token, user, permissions }),
      setToken: (token) => set({ token }),
      setPermissions: (permissions) => set({ permissions }),
      logout: () => set({ token: null, user: null, permissions: [] }),
      hasPermission: (featureCode, action = 'READ', section) => {
        const { permissions } = get();
        return permissions.some(
          (p) =>
            p.featureCode === featureCode &&
            (p.action === action || p.action === 'MANAGE') &&
            (p.section === null || !section || p.section === section),
        );
      },
    }),
    { name: STORAGE_KEYS.AUTH },
  ),
);
