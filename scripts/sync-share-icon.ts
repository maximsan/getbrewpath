/**
 * Writes the app icon into the code as text, for share images to draw.
 *
 *   pnpm sync-share-icon
 *
 * A Cloudflare Worker has no disk, so a share image drawn there can't read
 * `public/`. Rerun it whenever `public/images/app-icon.png` changes.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import sharp from 'sharp';

import { BRAND_ICON_PATH, SHARE_ICON_SIZE } from '../src/domains/site/brand';

const OUTPUT_FILE = 'src/app/components/og/share-icon.ts';

// Twice the drawn size, so the icon stays sharp on high-density screens.
const png = await sharp(join('public', BRAND_ICON_PATH))
  .resize(SHARE_ICON_SIZE * 2)
  .png()
  .toBuffer();

writeFileSync(
  OUTPUT_FILE,
  `/** The app icon as a PNG data URL. Written by \`pnpm sync-share-icon\`; do not edit by hand. */
export const SHARE_ICON_DATA_URL =
  'data:image/png;base64,${png.toString('base64')}';
`,
);
console.log(`Wrote ${OUTPUT_FILE} (${png.length} bytes of PNG)`);
