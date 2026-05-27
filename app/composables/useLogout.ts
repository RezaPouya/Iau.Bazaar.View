export const useLogout = () => {

  const auth = useAuthStore()

  const { $api } = useNuxtApp()

  const logout = async () => {

    try {

      await $api.post('/account/logout')

    } catch {}

    auth.clearAuth()

    await navigateTo('/login')
  }

  return {
    logout
  }
}