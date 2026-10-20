'use client';

import NextError from 'next/error';

import { routing } from '@i18n/routing';

/**
 * The 404 for addresses `src/proxy.ts` leaves alone, such as a missing image.
 * Every other unknown address shows the designed page in `[locale]/not-found.tsx`.
 */
export default function RootNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body>
        <NextError statusCode={404} />
      </body>
    </html>
  );
}
