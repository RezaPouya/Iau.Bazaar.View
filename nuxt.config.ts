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
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // Security headers (client-side)
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
        { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' }
      ]
    }
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          // ✅ Fix CSP to allow API connections
          'Content-Security-Policy': "default-src 'self'; connect-src 'self' https://localhost:7139 https://localhost:7139; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        }
      }
    }
  }
});