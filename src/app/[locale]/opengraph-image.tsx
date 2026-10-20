import { getTranslations } from 'next-intl/server';

import { OG_SIZE, renderOgImage } from '@components/og/og-image';
import { SELLING_MODEL } from '@domains/site/site';
import { type LocaleParams, localeRouteParams, setPageLocale } from '@i18n/page-locale';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'BrewPath — learn coffee, grow a tree';

export const generateStaticParams = localeRouteParams;

export default async function OpenGraphImage({ params }: LocaleParams) {
  const t = await getTranslations({ locale: await setPageLocale(params) });
  return renderOgImage({
    kicker: t('brand'),
    title: t('hero.title'),
    body: t('hero.note', { model: SELLING_MODEL }),
  });
}
