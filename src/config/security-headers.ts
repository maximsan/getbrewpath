/**
 * Security headers on every response. Pages get them from `next.config.ts`.
 * Static files skip Next.js on Cloudflare, so `scripts/write-static-headers.ts`
 * writes the same list into `public/_headers` for them.
 */
export const SECURITY_HEADERS = [
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
