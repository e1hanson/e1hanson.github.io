// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Гротеск с кириллицей, вариативный, без курсивных начертаний.
 * @param {string} name
 * @param {string} cssVariable
 * @param {string} [weights]
 */
const sans = (name, cssVariable, weights = '100 900') => ({
  provider: fontProviders.fontsource(),
  name,
  cssVariable,
  weights: /** @type {[string]} */ ([weights]),
  styles: /** @type {['normal']} */ (['normal']), // курсив не подключается вообще
  subsets: /** @type {[string, string]} */ (['cyrillic', 'latin']),
  fallbacks: ['system-ui', 'sans-serif'],
});

// https://astro.build/config
export default defineConfig({
  site: 'https://e1hanson.github.io',
  // Служебная витрина в карту сайта не входит
  integrations: [sitemap({ filter: (page) => !page.includes('/styleguide/') })],
  fonts: [
    sans('Geologica', '--font-display'),
    sans('Onest', '--font-text'),
    // кандидаты для сравнения — подключаются только на /styleguide/
    sans('Unbounded', '--font-alt-display', '200 900'),
    sans('Manrope', '--font-alt-text', '200 800'),
  ],
});
