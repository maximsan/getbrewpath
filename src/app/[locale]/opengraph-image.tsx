import { getTranslations } from 'next-intl/server';

import { OG_SIZE, renderOgImage } from '@components/og/og-image';
import { type LocaleParams, localeRouteParams, setPageLocale } from '@i18n/page-locale';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'BrewPath — learn coffee, grow a tree';

export const generateStaticParams = localeRouteParams;

export default async function OpenGraphImage({ params }: LocaleParams) {
  const translate = await getTranslations({ locale: await setPageLocale(params) });

  return renderOgImage({
    kicker: translate('brand'),
    title: translate('hero.title'),
    body: translate('hero.note'),
  });
}
