// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://productbuilders.io',
  integrations: [tailwind()],
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
