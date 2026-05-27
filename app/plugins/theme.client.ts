import { useTheme } from '~/composables/useTheme';

export default defineNuxtPlugin(() => {
  const { loadTheme } = useTheme();

  loadTheme();
});
