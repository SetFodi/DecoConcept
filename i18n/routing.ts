import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ka', 'ru'],
  defaultLocale: 'ka',
  // Always default everyone to Georgian instead of detecting the browser language.
  localeDetection: false
});
