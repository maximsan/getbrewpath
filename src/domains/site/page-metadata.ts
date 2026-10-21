import type { Metadata } from 'next';

import { languageVersions, localizedPath } from '@i18n/language-versions';
import type { Locale } from '@i18n/routing';

import { BRAND_NAME } from './brand';

/** The share image drawn by `src/app/[locale]/opengraph-image.tsx`. */
const SITE_SHARE_IMAGE = '/opengraph-image';

interface PageMetadataInput {
  locale: Locale;
  /** Shown in the tab as "<title> · BrewPath", unless `absoluteTitle` is set. */
  title?: string;
  absoluteTitle?: string;
  description: string;
  /** The page's address without a language prefix, e.g. "/terms". */
  path: string;
  /** The page's own share image, without a language prefix; defaults to the site's. */
  shareImage?: string;
}

/**
 * Title, description, canonical address, language versions and share preview for one page.
 * A page's `openGraph` replaces the layout's whole, so every page sets all of it here.
 */
export function pageMetadata({
  locale,
  title,
  absoluteTitle,
  description,
  path,
  shareImage = SITE_SHARE_IMAGE,
}: PageMetadataInput): Metadata {
  const shareTitle = absoluteTitle ?? title;
  return {
    ...(absoluteTitle ? { title: { absolute: absoluteTitle } } : title ? { title } : null),
    description,
    alternates: {
      canonical: localizedPath(locale, path),
      languages: languageVersions(path),
    },
    openGraph: {
      type: 'website',
      siteName: BRAND_NAME,
      url: localizedPath(locale, path),
      title: shareTitle,
      description,
      images: [localizedPath(locale, shareImage)],
    },
  };
}
