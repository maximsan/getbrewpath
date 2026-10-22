import { APPLE_APP_ID } from '@domains/site/site';

export const dynamic = 'force-static';

/**
 * The file iOS reads to learn which links to getbrewpath.com and
 * open.getbrewpath.com open the app. It must be served as JSON, without a
 * redirect. Only card links open the app. Every other address stays on the
 * site, including the home page.
 * Source: brewpath repo, docs/universal-links-setup.md.
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
