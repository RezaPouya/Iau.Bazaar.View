export const useTheme = () => {
  const toggleTheme = () => {
    const html = document.documentElement;

    html.classList.toggle('dark');

    localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
  };

  const loadTheme = () => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    }
  };

  return {
    toggleTheme,
    loadTheme,
  };
};
