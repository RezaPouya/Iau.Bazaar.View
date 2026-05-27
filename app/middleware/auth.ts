import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  
  // Make sure auth store is initialized
  if (!auth || typeof auth.isAuthenticated === 'undefined') {
    return;
  }

  if (!auth.isAuthenticated) {
    return navigateTo('/login');
  }
});