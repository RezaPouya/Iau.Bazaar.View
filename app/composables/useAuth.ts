export const useAuth = () => {
  const auth = useAuthStore();

  const isAuthenticated = computed(() => auth.isAuthenticated);
  const user = computed(() => auth.user);

  const login = async (username: string, password: string) => {
    const { $api } = useNuxtApp();

    try {
      const response = await $api.post('/account/sign-in-by-password', {
        userName: username,
        password: password,
      });

      const data = response.data.data;
      auth.setAuth(data);

      return { success: true, redirectUrl: data.panelUrl || '/' };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    const { logout: performLogout } = useLogout();
    await performLogout();
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
};
