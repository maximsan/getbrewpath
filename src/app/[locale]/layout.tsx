import '../globals.css';

import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { MoodProvider } from '@components/mood/mood-provider';
import { RevealOnScroll } from '@components/reveal/reveal-on-scroll';
import { SiteFooter } from '@components/site-footer/site-footer';
import { SiteHeader } from '@components/site-header/site-header';
import { WebAnalytics } from '@components/web-analytics/web-analytics';
import { BRAND_COLORS, BRAND_NAME } from '@domains/site/brand';
import { PAGE_ROUTES } from '@domains/site/routes';
import { SITE_URL } from '@domains/site/site';
import { pageMetadata } from '@domains/site/page-metadata';
import { type LocaleParams, localeRouteParams, setPageLocale } from '@i18n/page-locale';

import { fontClasses } from '../fonts';

/**
 * Marks `<html>` for CSS. `js`, added before paint, lets scroll-reveal blocks start
 * hidden only when JavaScript is on. `page-loaded`, added at the window load event,
 * is for styles that wait until the first screen has loaded.
 */
const MARK_PAGE_SCRIPT =
  "document.documentElement.classList.add('js');" +
  "addEventListener('load', () => document.documentElement.classList.add('page-loaded'));";

/** Every language is known at build time; any other code is a 404. */
export const dynamicParams = false;

export const generateStaticParams = localeRouteParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await setPageLocale(params);
  const translate = await getTranslations({ locale, namespace: 'metadata' });

  return {
    ...pageMetadata({ locale, description: translate('description'), path: PAGE_ROUTES.home }),
    metadataBase: new URL(SITE_URL),
    title: { default: translate('title'), template: translate('titleTemplate') },
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

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: ReactNode }) {
  const locale = await setPageLocale(params);
  const translate = await getTranslations('nav');

  return (
    <html lang={locale} suppressHydrationWarning className={fontClasses(locale)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARK_PAGE_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <MoodProvider>
            <a
              href="#main"
              className="ff-ui sr-only rounded-full bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60"
            >
              {translate('skip')}
            </a>
            <SiteHeader />
            <main id="main" tabIndex={-1} className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <RevealOnScroll />
          </MoodProvider>
        </NextIntlClientProvider>
        <WebAnalytics />
      </body>
    </html>
  );
}
