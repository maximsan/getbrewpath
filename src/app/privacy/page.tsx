import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LegalDoc } from '@components/legal-doc/legal-doc';
import { PAGE_ROUTES } from '@domains/site/routes';

import { pageMetadata } from '@domains/site/page-metadata';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('docs.privacy');
  return pageMetadata({ title: t('title'), description: t('intro'), path: PAGE_ROUTES.privacy });
}

export default function PrivacyPage() {
  return <LegalDoc doc="privacy" />;
}
