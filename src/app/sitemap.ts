import type { MetadataRoute } from 'next';

import { PAGE_ROUTES } from '@domains/site/routes';
import { SITE_URL } from '@domains/site/site';
import { languageVersions, localizedPath } from '@i18n/language-versions';
import { routing } from '@i18n/routing';

const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;

/**
 * Each page once, in the default language, listing its other language versions.
 * Card pages are left out: people reach them from links friends send, not from search.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGE_ROUTES).map((path) => ({
    url: absoluteUrl(localizedPath(routing.defaultLocale, path)),
    alternates: {
      languages: Object.fromEntries(
        Object.entries(languageVersions(path)).map(([language, version]) => [
          language,
          absoluteUrl(version),
        ]),
      ),
    },
  }));
}
