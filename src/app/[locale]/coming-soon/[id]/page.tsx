import type { Metadata } from 'next';

import { ComingSoon, comingSoonMetadata } from '@components/coming-soon/coming-soon';
import { cardRouteParams } from '@domains/course/course';
import { comingSoonPath } from '@domains/site/routes';
import { setPageLocale } from '@i18n/page-locale';

interface CardComingSoonProps {
  params: Promise<{ locale: string; id: string }>;
}

/** Every card is known at build time; any other id is a 404, as on the card page. */
export const dynamicParams = false;

export const generateStaticParams = cardRouteParams;

export async function generateMetadata({ params }: CardComingSoonProps): Promise<Metadata> {
  return comingSoonMetadata(await setPageLocale(params), comingSoonPath((await params).id));
}

export default async function CardComingSoonPage({ params }: CardComingSoonProps) {
  await setPageLocale(params);

  return <ComingSoon cardId={(await params).id} />;
}
