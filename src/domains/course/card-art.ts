import { cache } from 'react';
import { z } from 'zod';

import type { Mood } from '@domains/site/mood';
import type { Locale } from '@i18n/routing';

const imageSchema = z.string().startsWith('<svg xmlns="http://www.w3.org/2000/svg"');

export const cardArtSchema = z.record(
  z.string(),
  z.object({
    cupping: imageSchema,
    'dark-roast': imageSchema,
  }),
);

/** Drawing-only SVGs with the app's labels fitted and CSS palette resolved by sync-cards. */
const ART_FILES: Record<Locale, () => Promise<{ default: unknown }>> = {
  en: () => import('@content/en/card-art.json'),
};
const getArt = cache(async (locale: Locale) =>
  cardArtSchema.parse((await ART_FILES[locale]()).default),
);

/** Returns artwork as an image URL so imported SVG stays out of the page markup. */
export async function findCardArtImage(locale: Locale, kind: string, mood: Mood) {
  const drawing = (await getArt(locale))[kind]?.[mood];

  return drawing
    ? `data:image/svg+xml;base64,${Buffer.from(drawing).toString('base64')}`
    : undefined;
}

export async function getCardArtImage(locale: Locale, kind: string, mood: Mood) {
  const illustration = await findCardArtImage(locale, kind, mood);

  if (!illustration) {
    throw new Error(`Missing ${locale} Coffee Card illustration ${kind}`);
  }

  return illustration;
}
