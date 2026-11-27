import type { Metadata } from 'next';

import { ComingSoon, comingSoonMetadata } from '@components/coming-soon/coming-soon';
import { comingSoonPath } from '@domains/site/routes';
import { type LocaleParams, setPageLocale } from '@i18n/page-locale';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return comingSoonMetadata(await setPageLocale(params), comingSoonPath());
}

export default async function ComingSoonPage({ params }: LocaleParams) {
  await setPageLocale(params);

  return <ComingSoon />;
}
