export default defineNuxtRouteMiddleware(() => {
  // Guest middleware - redirect authenticated users away from login/register pages
  const auth = useAuthStore();
  
  if (auth.isAuthenticated) {
    return navigateTo('/');
  }
});

