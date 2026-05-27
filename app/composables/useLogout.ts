export const useLogout = () => {
  const auth = useAuthStore();
  const { $api } = useNuxtApp();

  const logout = async () => {
    try {
      if (auth.accessToken) {
        await $api.post('/account/logout');
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      auth.clearAuth();
      await navigateTo('/login');
    }
  };

  return {
    logout
  };
};