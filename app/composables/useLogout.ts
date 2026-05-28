export const useLogout = () => {
  const auth = useAuthStore();
  const { $api } = useNuxtApp();

  const logout = async () => {
    try {
      debugger;
      if (auth.accessToken) {
        try {
          await $api.post('/account/logout');
        } catch (apiError: any) {
          debugger;
          // If we get 401, the token is already invalid - that's fine
          if (apiError.response?.status !== 401) {
            console.error('Logout API error:', apiError);
          }
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local auth state regardless of API response
      auth.clearAuth();
      await navigateTo('/login');
    }
  };

  return {
    logout,
  };
};
