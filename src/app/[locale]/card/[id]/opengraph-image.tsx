import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { OG_SIZE, renderOgImage } from '@components/og/og-image';
import { cardShareImageParams, findCard, getCourse } from '@domains/course/course';
import { setPageLocale } from '@i18n/page-locale';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'A BrewPath Coffee Card';

export const generateStaticParams = cardShareImageParams;

export default async function CardOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const locale = await setPageLocale(params);
  const card = findCard(await getCourse(locale), (await params).id);
  if (!card) notFound();
  const t = await getTranslations({ locale, namespace: 'card' });
  return renderOgImage({
    kicker: t('shared'),
    title: card.reward.title,
    body: card.reward.summary,
  });
}
