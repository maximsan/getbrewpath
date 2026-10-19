import type { Metadata } from 'next';

import { BRAND_NAME } from './brand';

/** The share image drawn by `src/app/opengraph-image.tsx`. */
const SITE_SHARE_IMAGE = '/opengraph-image';

interface PageMetadataInput {
  /** Shown in the tab as "<title> · BrewPath", unless `absoluteTitle` is set. */
  title?: string;
  absoluteTitle?: string;
  description: string;
  path: string;
  /** The page's own share image; defaults to the site's. */
  shareImage?: string;
}

/**
 * Title, description, canonical address and share preview for one page.
 * A page's `openGraph` replaces the layout's whole, so every page sets all of it here.
 */
export function pageMetadata({
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
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: BRAND_NAME,
      url: path,
      title: shareTitle,
      description,
      images: [shareImage],
    },
  };
}
