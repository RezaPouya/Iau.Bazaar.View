// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  ],
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  plugins: [
    '~/plugins/api',
    '~/plugins/theme.client',
    '~/plugins/auth-init.client'
  ],
  runtimeConfig: {
    public: {
      apiBase: 'https://localhost:7139/api',
    },
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  // Security headers for production only
  nitro: process.env.NODE_ENV === 'production' ? {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://your-production-api.com;"
        }
      }
    }
  } : {} // No CSP headers in development
});