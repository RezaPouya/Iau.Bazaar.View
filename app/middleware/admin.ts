export default defineNuxtRouteMiddleware(() => {

  const auth = useAuthStore();

  if (!auth.user) {

    return navigateTo('/login');
  }

  const role = auth.user.role;

  const isAdmin =
    role === 'Admin' ||
    role === 'Operator';

  if (!isAdmin) {

    return navigateTo('/');
  }
});