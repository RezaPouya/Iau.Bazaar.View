import { sanitizeRouteParams } from '~/utils/xssProtection';

export default defineNuxtRouteMiddleware((to) => {
  // Sanitize route params
  to.params = sanitizeRouteParams(to.params);
  to.query = sanitizeRouteParams(to.query);
});