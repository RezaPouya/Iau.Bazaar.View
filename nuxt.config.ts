// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  plugins: [
    '~/plugins/api',
    '~/plugins/theme.client',
    '~/stores/auth.client' // Add this if not auto-detected
  ],
  runtimeConfig: {
    public: {
      apiBase: 'https://localhost:7139/api',
    },
  },
});
