import createMiddleware from 'next-intl/middleware';

import { routing } from '@i18n/routing';

/** Serves English at the bare address by rewriting `/terms` to `/en/terms`, and drops a redundant `/en`. */
export default createMiddleware(routing);

export const config = {
  // Everything but Next's own files, the iOS app-link file and files with an extension (images, robots.txt).
  matcher: ['/((?!_next|_vercel|\\.well-known|.*\\..*).*)'],
};
