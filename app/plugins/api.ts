import axios from 'axios';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBase,
    timeout: 30000,
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // IMPORTANT:
      // get fresh store state every request
      const auth = useAuthStore();

      if (auth.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;

        config.headers['X-Requested-With'] = 'XMLHttpRequest';
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const auth = useAuthStore();

      const originalRequest = error.config;

      if (originalRequest?.url?.includes('/account/logout')) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (auth.refreshToken) {
          try {
            await auth.refreshAuthToken();

            originalRequest.headers.Authorization = `Bearer ${auth.accessToken}`;

            return api(originalRequest);
          } catch (refreshError) {
            auth.clearAuth();

            await navigateTo('/login');

            return Promise.reject(refreshError);
          }
        }

        auth.clearAuth();

        await navigateTo('/login');
      }

      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api,
    },
  };
});
