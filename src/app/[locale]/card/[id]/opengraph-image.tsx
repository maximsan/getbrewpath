import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { OG_SIZE, renderOgImage } from '@components/og/og-image';
import { findCard, getCourse, localeCardRouteParams } from '@domains/course/course';
import { getCardArtImage } from '@domains/course/card-art';
import { setPageLocale } from '@i18n/page-locale';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'A BrewPath Coffee Card';

/** Every card's share image is built ahead of time; any other one is a 404, never drawn on a visit. */
export const dynamicParams = false;

export const generateStaticParams = localeCardRouteParams;

export default async function CardOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const locale = await setPageLocale(params);
  const card = findCard(await getCourse(locale), (await params).id);

  if (!card) {
    notFound();
  }
  const [translate, illustration] = await Promise.all([
    getTranslations({ locale, namespace: 'card' }),
    getCardArtImage(locale, card.kind, 'cupping'),
  ]);

  return renderOgImage({
    kicker: translate('shared'),
    title: card.reward.title,
    body: card.reward.summary,
    illustration,
  });
}
