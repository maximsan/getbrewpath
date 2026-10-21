import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { MoodProvider } from '@components/mood/mood-provider';
import { RevealOnScroll } from '@components/reveal/reveal-on-scroll';
import { SiteFooter } from '@components/site-footer/site-footer';
import { SiteHeader } from '@components/site-header/site-header';
import { BRAND_COLORS, BRAND_NAME } from '@domains/site/brand';
import { PAGE_ROUTES } from '@domains/site/routes';
import { SITE_URL } from '@domains/site/site';
import { cn } from '@shared/styles/cn';

import { fraunces, plexMono, plexSans } from './fonts';
import { pageMetadata } from '@domains/site/page-metadata';

/** Runs before paint so scroll-reveal blocks start hidden only when JavaScript is on. */
const MARK_JS = "document.documentElement.classList.add('js')";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    ...pageMetadata({ description: t('description'), path: PAGE_ROUTES.home }),
    metadataBase: new URL(SITE_URL),
    title: { default: t('title'), template: t('titleTemplate') },
    applicationName: BRAND_NAME,
    twitter: { card: 'summary_large_image' },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND_COLORS.paper },
    { media: '(prefers-color-scheme: dark)', color: BRAND_COLORS.darkRoast },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const t = await getTranslations('nav');

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(fraunces.variable, plexSans.variable, plexMono.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARK_JS }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <MoodProvider>
            <a
              href="#main"
              className="ff-ui sr-only rounded-full bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
            >
              {t('skip')}
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <RevealOnScroll />
          </MoodProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
