import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/**
 * Every page and share image is drawn at build time and never revalidated, so
 * the read-only static-assets cache serves them all. `opennextjs-cloudflare
 * preview` and `deploy` fill it; a plain `wrangler deploy` leaves it empty.
 * See https://opennext.js.org/cloudflare/caching#ssg-site
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
