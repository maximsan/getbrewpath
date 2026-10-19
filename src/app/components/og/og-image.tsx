import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

const PAPER = '#F4EFE6';
const INK = '#1B1614';
const INK_MUTE = '#6B5F54';
const CREMA = '#A6462F';

const iconDataUrl = async () => {
  const icon = await readFile(join(process.cwd(), 'public/images/app-icon.png'));
  return `data:image/png;base64,${icon.toString('base64')}`;
};

interface OgImageProps {
  kicker: string;
  title: string;
  body: string;
}

/** The share preview for the site and for each card: icon, a small line, a title and a sentence. */
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
        background: PAPER,
        color: INK,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only */}
        <img src={icon} width={72} height={72} alt="" style={{ borderRadius: 18 }} />
        <span style={{ fontSize: 40, color: CREMA }}>{kicker}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, whiteSpace: 'pre-line' }}>{title}</div>
        <div style={{ fontSize: 32, lineHeight: 1.4, color: INK_MUTE, maxWidth: 960 }}>{body}</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
