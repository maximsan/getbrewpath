import createMiddleware from 'next-intl/middleware';

import { routing } from '@i18n/routing';

/** Serves English at the bare address by rewriting `/terms` to `/en/terms`, and drops a redundant `/en`. */
export default createMiddleware(routing);

export const config = {
  // Every address except /_next/, /_vercel/, /.well-known/apple-app-site-association
  // and files with an extension, such as images and robots.txt.
  matcher: ['/((?!_next|_vercel|\\.well-known|.*\\..*).*)'],
};
