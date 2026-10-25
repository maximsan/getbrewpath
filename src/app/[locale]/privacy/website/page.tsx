import type { Metadata } from 'next';

import { LegalDoc, legalDocMetadata } from '@components/legal-doc/legal-doc';
import { type LocaleParams, setPageLocale } from '@i18n/page-locale';

export const generateMetadata = ({ params }: LocaleParams): Promise<Metadata> =>
  legalDocMetadata('websitePrivacy', params);

export default async function WebsitePrivacyPage({ params }: LocaleParams) {
  await setPageLocale(params);

  return <LegalDoc doc="websitePrivacy" />;
}
