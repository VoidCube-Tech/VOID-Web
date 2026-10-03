// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: process.env.PUBLIC_SITE_URL || PUBLIC_SITE_URL || undefined,

  i18n: {
    locales: ['en', 'pt-BR'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false
    }
  },

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});
