export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();
  // Restore session if exists
  await auth.restoreSession();
  
  // Schedule refresh if authenticated
  if (auth.accessToken) {
    auth.scheduleRefresh();
  }
});