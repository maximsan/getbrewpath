import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LegalDoc } from '@components/legal-doc/legal-doc';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('docs.privacy');
  return { title: t('title'), description: t('intro'), alternates: { canonical: '/privacy' } };
}

export default function PrivacyPage() {
  return <LegalDoc doc="privacy" />;
}
