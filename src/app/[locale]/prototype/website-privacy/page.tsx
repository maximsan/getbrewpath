import { Suspense } from 'react';

import { type LocaleParams, setPageLocale } from '@i18n/page-locale';

import { WebsitePrivacyVariants } from './variants';

/**
 * PROTOTYPE ONLY. Three drafts of the website privacy page, switchable via
 * `?variant=A|B|C`, for the owner to react to. Ticket: getbrewpath#18.
 * Not linked from anywhere; delete before merging.
 */
export default async function WebsitePrivacyPrototypePage({ params }: LocaleParams) {
  await setPageLocale(params);
  return (
    <Suspense>
      <WebsitePrivacyVariants />
    </Suspense>
  );
}
