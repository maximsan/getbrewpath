import { getTranslations } from 'next-intl/server';

import { OG_SIZE, renderOgImage } from '@components/og/og-image';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'BrewPath — learn coffee, grow a tree';

export default async function OpenGraphImage() {
  const t = await getTranslations();
  return renderOgImage({ kicker: t('brand'), title: t('hero.title'), body: t('hero.note') });
}
