// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: https://juniniv3.github.io/guia-genia-edu/
  site: 'https://juniniv3.github.io',
  base: '/guia-genia-edu',
  integrations: [react()]
});
