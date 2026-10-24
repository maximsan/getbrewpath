import { WEB_ANALYTICS_ENDPOINT, WEB_ANALYTICS_SCRIPT } from '../domains/site/site';

/**
 * Where a page may load scripts from. A strict policy marks each inline script
 * with a nonce, a one-time code the server writes into every response. Every page
 * here is built ahead of time, so the inline scripts of Next.js and next-themes
 * are allowed as 'unsafe-inline' instead, as in the Next.js guide's policy for
 * that case.
 */
const SCRIPT_SOURCES = [
  "'self'",
  "'unsafe-inline'",
  new URL(WEB_ANALYTICS_SCRIPT).origin,
  // `pnpm dev` runs code through eval for its live reload.
  ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
];

/** What a page may load. */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src ${SCRIPT_SOURCES.join(' ')}`,
  `connect-src 'self' ${WEB_ANALYTICS_ENDPOINT}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

/**
 * Security headers on every response. Pages get them from `next.config.ts`.
 * Static files skip Next.js on Cloudflare, so `scripts/write-static-headers.ts`
 * writes the same list into `public/_headers` for them.
 */
export const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
