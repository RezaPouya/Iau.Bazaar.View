export default defineNuxtPlugin(() => {
  const auth = useAuthStore();
  // Restore session if exists (synchronous)
  auth.restoreSession();
  
  // Schedule refresh if authenticated
  if (auth.accessToken) {
    auth.scheduleRefresh();
  }
});