import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { OG_SIZE, renderOgImage } from '@components/og/og-image';
import { course, findCard } from '@domains/course/course';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'A BrewPath Coffee Card';

export function generateStaticParams() {
  return course.cards.map((card) => ({ id: card.id }));
}

export default async function CardOpenGraphImage({ params }: { params: Promise<{ id: string }> }) {
  const card = findCard((await params).id);
  if (!card) notFound();
  const t = await getTranslations('card');
  return renderOgImage({
    kicker: t('shared'),
    title: card.reward.title,
    body: card.reward.summary,
  });
}
