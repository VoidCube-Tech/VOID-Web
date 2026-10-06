// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const { PUBLIC_SITE_URL } = loadEnv(
  // @ts-ignore
  process.env.NODE_ENV ?? 'production',
  // @ts-ignore
  process.cwd(),
  'PUBLIC_'
);

export default defineConfig({
  output: 'static',
  site: PUBLIC_SITE_URL || undefined,

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