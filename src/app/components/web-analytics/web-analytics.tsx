import { WEB_ANALYTICS_SCRIPT, WEB_ANALYTICS_TOKEN } from '@domains/site/site';

/**
 * Cloudflare Web Analytics' script, which counts visits and stores nothing in the browser:
 * https://developers.cloudflare.com/web-analytics/get-started/
 * Only production builds load it, so `pnpm dev` counts no visits. A local `pnpm preview`
 * is a production build and does count.
 */
export function WebAnalytics() {
  if (process.env.NODE_ENV !== 'production') return null;
  return (
    <script
      defer
      src={WEB_ANALYTICS_SCRIPT}
      data-cf-beacon={JSON.stringify({ token: WEB_ANALYTICS_TOKEN })}
    />
  );
}
