import { ComingSoon, generateComingSoonMetadata } from '@components/coming-soon/coming-soon';
import { type LocaleParams, setPageLocale } from '@i18n/page-locale';

export const generateMetadata = generateComingSoonMetadata;

export default async function ComingSoonPage({ params }: LocaleParams) {
  await setPageLocale(params);

  return <ComingSoon />;
}
