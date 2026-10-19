import type { MetadataRoute } from 'next';

import { PAGE_ROUTES } from '@domains/site/routes';
import { SITE_URL } from '@domains/site/site';

/** Card pages are left out: people reach them from links friends send, not from search. */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGE_ROUTES).map((path) => ({ url: new URL(path, SITE_URL).href }));
}
