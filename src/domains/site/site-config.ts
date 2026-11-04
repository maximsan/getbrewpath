export const SITE_HOST = 'getbrewpath.com';
export const SITE_URL = `https://${SITE_HOST}`;

export const WEB_ANALYTICS_SCRIPT = 'https://static.cloudflareinsights.com/beacon.min.js';
export const WEB_ANALYTICS_ENDPOINT = 'https://cloudflareinsights.com';

/**
 * The app opens card links from two domains: `SITE_HOST` and this one. iOS
 * ignores such a link when it is tapped on a page of the same domain. So
 * "Open in the app" on a card page points here.
 */
export const APP_LINKS_HOST = 'open.getbrewpath.com';

export const APP_STORE_ID = '6827754824';
export const APP_STORE_URL = `https://apps.apple.com/app/brewpath/id${APP_STORE_ID}`;
