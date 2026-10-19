import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LegalDoc } from '@components/legal-doc/legal-doc';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('docs.terms');
  return { title: t('title'), description: t('intro'), alternates: { canonical: '/terms' } };
}

export default function TermsPage() {
  return <LegalDoc doc="terms" />;
}
