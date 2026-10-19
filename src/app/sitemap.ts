import type { MetadataRoute } from 'next';

import { SITE_URL } from '@domains/site/site';

/** Shared card pages are left out: they are reached from links people send, not from search. */
const PAGES = ['', '/support', '/press', '/terms', '/privacy'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({ url: `${SITE_URL}${path}` }));
}
