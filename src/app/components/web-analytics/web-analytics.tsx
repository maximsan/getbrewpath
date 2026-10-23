import { WEB_ANALYTICS_TOKEN } from '@domains/site/site';

/**
 * Cloudflare Web Analytics' script, which counts visits and stores nothing in the browser:
 * https://developers.cloudflare.com/web-analytics/get-started/
 * Only production builds load it, so local development is not counted.
 */
export function WebAnalytics() {
  if (process.env.NODE_ENV !== 'production') return null;
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: WEB_ANALYTICS_TOKEN })}
    />
  );
}
