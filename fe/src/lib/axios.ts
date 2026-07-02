import axios from 'axios';
import { toast } from 'sonner';
import CONFIG from '~/configs/app';
import { HttpClient } from '~/lib/http-client';
import { useAuthStore } from '~/stores/auth';

// ============================================================
// API chính (backend ITAM)
// ============================================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
}

const api = new HttpClient(
  {
    baseURL: CONFIG.MAIN_API_URL,
    withCredentials: true,
  },
  (ins) => {
    ins.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    ins.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status !== 401 ||
          originalRequest._retry ||
          originalRequest.url?.includes('/auth/login')
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return ins(originalRequest);
          });
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const { data } = await axios.post(
            `${ins.defaults.baseURL}/auth/refresh`,
            {},
            { withCredentials: true },
          );
          const newToken = data.data.token;
          useAuthStore.getState().setToken(newToken);
          if (data.data.permissions) {
            useAuthStore.getState().setPermissions(data.data.permissions);
          }
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return ins(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          useAuthStore.getState().logout();
          toast.error('Phiên đăng nhập hết hạn');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      },
    );
  },
);

// ============================================================
// API bên thứ 3: JSONPlaceholder (fake)
// ============================================================

export const jsonPlaceholderApi = new HttpClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

// ============================================================

export default api;
