import { defineStore } from 'pinia';
import type { AuthUser, LoginResponse } from '~/types/auth';
import { getTokenExpiration } from '~/utils/jwt';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('');
  const refreshToken = ref('');
  const user = ref<AuthUser | null>(null);
  const refreshTimeout = ref<NodeJS.Timeout | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  const scheduleRefresh = () => {
    if (!accessToken.value) return;

    const expiration = getTokenExpiration(accessToken.value);
    const now = Date.now();
    const timeout = expiration - now - 60000; // Refresh 1 minute before expiry

    if (timeout <= 0) {
      refreshAuthToken();
      return;
    }

    if (refreshTimeout.value) {
      clearTimeout(refreshTimeout.value);
    }

    refreshTimeout.value = setTimeout(() => {
      refreshAuthToken();
    }, timeout);
  };

  const refreshAuthToken = async () => {
    try {
      const config = useRuntimeConfig();
      const response = await $fetch<any>(
        `${config.public.apiBase}/account/refresh-token`,
        {
          method: 'POST',
          body: { refreshToken: refreshToken.value },
        }
      );

      setAuth(response.data);
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuth();
      await navigateTo('/login');
    }
  };

  const setAuth = (data: LoginResponse) => {
    accessToken.value = data.accessToken;
    refreshToken.value = data.refreshToken;
    user.value = {
      userId: data.userId,
      role: data.role,
      panelUrl: data.panelUrl,
    };
    
    // Use sessionStorage instead of localStorage (auto-cleared when tab closes)
    sessionStorage.setItem('access_token', data.accessToken);
    sessionStorage.setItem('refresh_token', data.refreshToken);
    sessionStorage.setItem('user', JSON.stringify(user.value));
    
    scheduleRefresh();
  };

  const clearAuth = () => {
    accessToken.value = '';
    refreshToken.value = '';
    user.value = null;
    
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    
    if (refreshTimeout.value) {
      clearTimeout(refreshTimeout.value);
      refreshTimeout.value = null;
    }
  };

  // Restore session from sessionStorage on app load
  const restoreSession = () => {
    const storedAccessToken = sessionStorage.getItem('access_token');
    const storedRefreshToken = sessionStorage.getItem('refresh_token');
    const storedUser = sessionStorage.getItem('user');
    
    if (storedAccessToken && storedRefreshToken && storedUser) {
      accessToken.value = storedAccessToken;
      refreshToken.value = storedRefreshToken;
      user.value = JSON.parse(storedUser);
      scheduleRefresh();
      return true;
    }
    return false;
  };

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
    refreshAuthToken,
    scheduleRefresh,
    restoreSession,
  };
}, {
  persist: false, // Disable auto-persist, we manually control sessionStorage
});