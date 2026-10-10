// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import { DEFAULT_LOCALE, LOCALES } from './src/i18n/locales.ts';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: https://juniniv3.github.io/guia-genia-edu/
  site: 'https://juniniv3.github.io',
  base: '/guia-genia-edu',
  // Spanish (the original) is served unprefixed; translations live under /<locale>/, e.g. /guia-genia-edu/en/.
  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: { prefixDefaultLocale: false },
  },
  integrations: [react(), mdx()]
});
