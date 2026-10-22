import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/**
 * Every page and share image is drawn once, at build time, and never redrawn.
 * So the Worker serves them from copies stored with the site's static files.
 * `opennextjs-cloudflare preview` and `deploy` upload those copies; a plain
 * `wrangler deploy` uploads none.
 * See https://opennext.js.org/cloudflare/caching#ssg-site
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
