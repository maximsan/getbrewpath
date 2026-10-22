import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { routing } from './src/i18n/routing';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const securityHeaders = [
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const { defaultLocale, locales } = routing;

/**
 * A bare address that belongs to the default language: not a language
 * prefix, not Next.js's own files, not the universal-link file, and not a
 * file with an extension, such as an image or robots.txt. The default
 * language's own prefix is excluded too, because Next.js keeps applying
 * rewrites to an already rewritten address.
 */
const bareAddress = `/:path((?!(?:${[...locales, '_next', '\\.well-known'].join('|')})(?:/|$))[^.]*)`;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  // The default language keeps the bare addresses (see `src/i18n/routing.ts`).
  // Done here rather than in a proxy, whose Cloudflare support is experimental.
  async redirects() {
    return [
      { source: `/${defaultLocale}`, destination: '/', permanent: false },
      { source: `/${defaultLocale}/:path*`, destination: '/:path*', permanent: false },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: `/${defaultLocale}` },
        { source: bareAddress, destination: `/${defaultLocale}/:path` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withNextIntl(nextConfig);
