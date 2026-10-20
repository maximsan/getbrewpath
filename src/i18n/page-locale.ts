import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { type Locale, routing } from './routing';

/** The route params of every page under `[locale]`. */
export interface LocaleParams {
  params: Promise<{ locale: string }>;
}

/**
 * The page's language, from its address. Also hands it to next-intl, which
 * lets the page be built ahead of time; an unknown code is a 404.
 */
export async function pageLocale(params: LocaleParams['params']): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

/** Route params for every language, which are all built ahead of time. */
export const localeRouteParams = () => routing.locales.map((locale) => ({ locale }));
