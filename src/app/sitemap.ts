import type { MetadataRoute } from 'next';

import { PAGE_ROUTES } from '@domains/site/routes';
import { SITE_URL } from '@domains/site/site';
import { getPathname } from '@i18n/navigation';
import { type Locale, routing } from '@i18n/routing';

const absoluteUrl = (locale: Locale, path: string) =>
  new URL(getPathname({ locale, href: path }), SITE_URL).href;

/**
 * Each page once, in the default language, listing its other language versions.
 * Card pages are left out: people reach them from links friends send, not from search.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGE_ROUTES).map((path) => ({
    url: absoluteUrl(routing.defaultLocale, path),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, absoluteUrl(locale, path)]),
      ),
    },
  }));
}
