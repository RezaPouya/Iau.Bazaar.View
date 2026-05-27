export default defineNuxtPlugin(() => {
  const auth = useAuthStore();
  
  // CRITICAL: Restore session on every client-side navigation
  const restored = auth.restoreSession();
  console.log('Plugin: Session restored:', restored);
  
  if (auth.accessToken) {
    console.log('Plugin: Token found, scheduling refresh');
    auth.scheduleRefresh();
  } else {
    console.log('Plugin: No token found');
  }
});