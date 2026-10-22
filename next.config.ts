import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { SECURITY_HEADERS } from './src/config/security-headers';
import { APP_LINKS_HOST, APP_STORE_ID, APP_STORE_URL, SITE_URL } from './src/domains/site/site';
import { routing } from './src/i18n/routing';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const { defaultLocale, locales } = routing;

/**
 * An address in the default language, which has no language prefix, such as
 * `/terms`. Left out:
 * - files with an extension, such as `/robots.txt`;
 * - Next.js's own files under `/_next`;
 * - every language prefix, in lower case only. Next.js keeps rewriting a
 *   rewritten address, so `/en` would become `/en/en`. On Cloudflare, `/EN`
 *   matches neither the redirect below nor a page, and fails with an error 500.
 */
const defaultLocaleAddress = `/:path((?!(?-i:${locales.join('|')})(?:/|$))(?!_next(?:/|$))[^.]*)`;

const onAppLinksHost = [{ type: 'host' as const, value: APP_LINKS_HOST }];

/**
 * The app links domain serves only the Apple link file. A card link reaches it
 * only when the app is missing, so it goes to the App Store, or to the card's
 * page while there is no listing. Every other address goes to the same path on
 * the site.
 */
const appLinksHostRedirects = [
  {
    source: '/card/:id',
    has: onAppLinksHost,
    destination: APP_STORE_ID === null ? `${SITE_URL}/card/:id` : APP_STORE_URL,
    permanent: false,
  },
  {
    source: '/:path((?!\\.well-known/).*)',
    has: onAppLinksHost,
    destination: `${SITE_URL}/:path`,
    permanent: false,
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: SECURITY_HEADERS }];
  },
  // `src/i18n/routing.ts` gives the default language addresses with no prefix.
  // These rules serve them. A proxy file could do the same, but OpenNext's
  // support for one on Cloudflare is still experimental.
  async redirects() {
    return [
      ...appLinksHostRedirects,
      { source: `/${defaultLocale}/:path*`, destination: '/:path*', permanent: false },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // The pattern below also matches `/`, but OpenNext then serves a 404.
        { source: '/', destination: `/${defaultLocale}` },
        { source: defaultLocaleAddress, destination: `/${defaultLocale}/:path` },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
