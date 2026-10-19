import { APPLE_APP_ID } from '@domains/site/site';

export const dynamic = 'force-static';

/**
 * The universal-link file iOS fetches before letting the app open links to
 * this domain (brewpath repo, docs/universal-links-setup.md). It must be
 * served as JSON, without a redirect.
 */
export function GET() {
  return Response.json({
    applinks: {
      details: [
        {
          appIDs: [APPLE_APP_ID],
          components: [
            { '/': '/', comment: 'the marketing entry' },
            { '/': '/card/*', comment: 'a shared collectible' },
          ],
        },
      ],
    },
  });
}
