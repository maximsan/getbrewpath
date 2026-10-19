/** Facts about the product that are not translated: links, mailboxes, prices, dates. */

export const SITE_URL = 'https://getbrewpath.com';
export const SITE_HOST = 'getbrewpath.com';

/** Placeholder listing until the App Store record exists; swap in the real id at launch. */
export const APP_STORE_URL = 'https://apps.apple.com/app/brewpath/id0000000000';

export const EMAIL_HELLO = 'hello@getbrewpath.com';
export const EMAIL_PRESS = 'press@getbrewpath.com';

export const PRICE_CURRENCY = 'USD';
export const PRICE_FREE = 0;
export const PRICE_FOUNDATIONS = 49.99;

export const MINUTES_PER_LESSON = 3;

/** Shown as "Last updated" on the Terms of Use and Privacy Policy. */
export const LEGAL_DOCS_UPDATED = '2026-10-14';

/**
 * The domain the app claims for universal links (brewpath repo,
 * lib/core/config/app_links.dart). iOS opens a universal link in the app
 * only when it is tapped on a page of another domain, so "Open in the app"
 * points there rather than at this site.
 */
export const APP_LINKS_ORIGIN = 'https://brewpath.maximsan.dev';
export const appCardLink = (cardId: string) => `${APP_LINKS_ORIGIN}/card/${cardId}`;

/** Apple identifiers the universal-link file vouches for (brewpath repo, docs/universal-links-setup.md). */
export const APPLE_APP_ID = '597GQ84U66.dev.maximsan.brewPath';

/** The year the site was first published, for the footer. */
export const COPYRIGHT_YEAR = 2026;
