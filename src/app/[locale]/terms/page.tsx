import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LegalDoc } from '@components/legal-doc/legal-doc';
import { pageMetadata } from '@domains/site/page-metadata';
import { PAGE_ROUTES } from '@domains/site/routes';
import { type LocaleParams, pageLocale } from '@i18n/page-locale';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await pageLocale(params);
  const t = await getTranslations({ locale, namespace: 'docs.terms' });
  return pageMetadata({
    locale,
    title: t('title'),
    description: t('intro'),
    path: PAGE_ROUTES.terms,
  });
}

export default async function TermsPage({ params }: LocaleParams) {
  await pageLocale(params);
  return <LegalDoc doc="terms" />;
}
