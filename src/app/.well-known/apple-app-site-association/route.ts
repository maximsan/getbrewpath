import { APPLE_APP_ID } from '@domains/site/site';

export const dynamic = 'force-static';

/**
 * The file iOS fetches before it lets the app open links to this domain.
 * It must be served as JSON, without a redirect.
 * Source: brewpath repo, docs/universal-links-setup.md.
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
