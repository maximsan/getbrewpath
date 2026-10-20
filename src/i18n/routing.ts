import { defineRouting } from 'next-intl/routing';

/**
 * The languages the site is published in. English keeps the bare addresses
 * (`/terms`); every other language is prefixed with its code (`/be/terms`).
 * Adding one: see the README, "Adding a language".
 */
export const routing = defineRouting({
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // A visitor picks a language from the footer links. The site never redirects
  // by browser language and stores no language cookie. Each address always
  // shows the same language.
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

/** Each language's name in itself, as the footer's language links show it. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
};
