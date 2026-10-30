/** Facts about the product that are not translated: links, mailboxes, dates. */

export const SITE_HOST = 'getbrewpath.com';
export const SITE_URL = `https://${SITE_HOST}`;

/** The numeric Apple ID of BrewPath's App Store Connect app record. */
export const APP_STORE_ID: string | null = '6827754824';
/** The real listing address; Apple controls availability before public release. */
export const APP_STORE_URL = `https://apps.apple.com/app/brewpath/id${APP_STORE_ID}`;

export const EMAIL_HI = 'hi@getbrewpath.com';
/** The link address that opens a new email to `email`. */
export const mailtoHref = (email: string) => `mailto:${email}`;
export const MAILTO_HI = mailtoHref(EMAIL_HI);
/** BrewPath's phone number, as the Terms of Use give it. */
export const PHONE = '+48 571 033 267';

export const MINUTES_PER_LESSON = 3;

/**
 * The app opens card links from two domains: `SITE_HOST` and this one. iOS
 * ignores such a link when it is tapped on a page of the same domain. So
 * "Open in the app" on a card page points here.
 * Source: brewpath repo, ios/Runner/Runner.entitlements.
 */
export const APP_LINKS_HOST = 'open.getbrewpath.com';
export const APP_LINKS_URL = `https://${APP_LINKS_HOST}`;
export const appCardLink = (cardId: string) => `${APP_LINKS_URL}/card/${cardId}`;

/**
 * The app's Apple team and bundle id, which the Apple link file names.
 * Source: the owner's ruling of 22 Oct 2026, recorded in the brewpath repo's
 * issue #171.
 */
export const APPLE_APP_ID = '7FXR6TDMDM.dev.maximsan.brewPath';

/** The year the site was first published, for the footer. */
export const COPYRIGHT_YEAR = 2026;

/**
 * The site's key in Cloudflare Web Analytics, which counts visits. It is public: every
 * page's HTML carries it. Source: `cf rum site-info list`, the site for getbrewpath.com.
 */
export const WEB_ANALYTICS_SITE_ID = '3dae933cda004cb198b689159f1ff8d7';
/** Cloudflare Web Analytics' script, which every page loads to count visits. */
export const WEB_ANALYTICS_SCRIPT = 'https://static.cloudflareinsights.com/beacon.min.js';
/** Where that script sends each visit. */
export const WEB_ANALYTICS_ENDPOINT = 'https://cloudflareinsights.com';
