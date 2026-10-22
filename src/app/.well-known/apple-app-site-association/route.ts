import { APPLE_APP_ID } from '@domains/site/site';

export const dynamic = 'force-static';

/**
 * The file iOS fetches before it lets the app open links to this site's two
 * domains. It must be served as JSON, without a redirect. Only card links open
 * the app; every other address, the home page included, stays on the site.
 * Source: brewpath repo, docs/universal-links-setup.md.
 * See https://github.com/maximsan/getbrewpath/issues/10
 */
export function GET() {
  return Response.json({
    applinks: {
      details: [
        {
          appIDs: [APPLE_APP_ID],
          components: [{ '/': '/card/*', comment: 'a shared Coffee Card' }],
        },
      ],
    },
  });
}
