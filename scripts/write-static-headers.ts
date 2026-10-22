/**
 * Writes `public/_headers`, the file Cloudflare reads for the headers of
 * static files, such as images and scripts.
 *
 *   pnpm write-static-headers
 *
 * `pnpm preview` runs it first, so the file is never edited by hand.
 * Format: https://developers.cloudflare.com/workers/static-assets/headers/
 */
import { writeFileSync } from 'node:fs';

import { SECURITY_HEADERS } from '../src/config/security-headers';

const OUTPUT_FILE = 'public/_headers';

const rule = (path: string, headers: { key: string; value: string }[]) =>
  [path, ...headers.map(({ key, value }) => `  ${key}: ${value}`)].join('\n');

writeFileSync(
  OUTPUT_FILE,
  [
    rule('/*', SECURITY_HEADERS),
    // Next.js puts a content hash in these file names, so a copy never goes stale.
    rule('/_next/static/*', [{ key: 'Cache-Control', value: 'public,max-age=31536000,immutable' }]),
  ].join('\n\n') + '\n',
);
console.log(`Wrote ${OUTPUT_FILE}`);
