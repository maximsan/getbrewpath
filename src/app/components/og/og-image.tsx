import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { BRAND_COLORS, BRAND_INK_MUTE } from '@domains/site/brand';

export const OG_SIZE = { width: 1200, height: 630 };

const iconDataUrl = async () => {
  // A literal path: the build copies only the files a server read names in full.
  const icon = await readFile(join(process.cwd(), 'src/assets/app-icon.png'));
  return `data:image/png;base64,${icon.toString('base64')}`;
};

interface OgImageProps {
  kicker: string;
  title: string;
  body: string;
}

/** The share image for the site and for each card: icon, a short label, a title and a sentence. */
export async function renderOgImage({ kicker, title, body }: OgImageProps) {
  const icon = await iconDataUrl();
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: BRAND_COLORS.paper,
        color: BRAND_COLORS.ink,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only */}
        <img src={icon} width={72} height={72} alt="" style={{ borderRadius: 18 }} />
        <span style={{ fontSize: 40, color: BRAND_COLORS.crema }}>{kicker}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, whiteSpace: 'pre-line' }}>{title}</div>
        <div style={{ fontSize: 32, lineHeight: 1.4, color: BRAND_INK_MUTE, maxWidth: 960 }}>
          {body}
        </div>
      </div>
    </div>,
    OG_SIZE,
  );
}
