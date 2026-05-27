import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();

  if (!auth.user) {
    return navigateTo('/login');
  }

  const roles = auth.user.role || [];
  const isAdmin = roles.includes('Admin') || roles.includes('Operator');

  if (!isAdmin) {
    return navigateTo('/');
  }
});