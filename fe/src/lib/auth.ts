import { useAuthStore } from '~/stores/auth';

export function isAuthenticated(): boolean {
  return !!useAuthStore.getState().token;
}
