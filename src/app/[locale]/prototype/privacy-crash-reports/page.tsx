import { Suspense } from 'react';

import { type LocaleParams, setPageLocale } from '@i18n/page-locale';

import { CrashReportVariants } from './variants';

/**
 * PROTOTYPE ONLY. Three ways to put crash reports into the app's Privacy Policy,
 * shown as old-versus-new per section, switchable via `?variant=A|B|C`.
 * Ticket: getbrewpath#20. Not linked from anywhere; delete before merging.
 */
export default async function CrashReportsPrototypePage({ params }: LocaleParams) {
  await setPageLocale(params);
  return (
    <Suspense>
      <CrashReportVariants />
    </Suspense>
  );
}
