import axios from 'axios';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();

  const api = axios.create({
    baseURL: config.public.apiBase,
    timeout: 30000,
  });

  // Add request interceptor
  api.interceptors.request.use(
    (config) => {
      if (auth.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
        // Add additional security headers (no tabId)
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Prevent infinite loops
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Try to refresh token
        if (auth.refreshToken) {
          try {
            await auth.refreshAuthToken();
            originalRequest.headers.Authorization = `Bearer ${auth.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear auth and redirect
            auth.clearAuth();
            
            // Store intended destination for after login
            const redirectUrl = window.location.pathname;
            if (redirectUrl !== '/login') {
              sessionStorage.setItem('redirectAfterLogin', redirectUrl);
            }
            
            await navigateTo('/login');
            return Promise.reject(refreshError);
          }
        } else {
          auth.clearAuth();
          await navigateTo('/login');
        }
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