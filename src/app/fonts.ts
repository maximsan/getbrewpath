import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';

import type { Locale } from '@i18n/routing';

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

/**
 * The headline serif for each language. Fraunces has Latin letters only.
 * The app draws Belarusian headings in Literata instead.
 * A new language needs a serif that covers its script. Every serif sets `--font-serif`.
 */
const DISPLAY_FONT: Record<Locale, typeof fraunces> = {
  en: fraunces,
};

/** The classes that load the fonts for `locale` and name them in CSS. */
export const fontClasses = (locale: Locale) =>
  [DISPLAY_FONT[locale].variable, plexSans.variable, plexMono.variable].join(' ');
