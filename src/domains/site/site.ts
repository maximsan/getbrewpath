/** Facts about the product that are not translated: links, mailboxes, dates. */

export const SITE_HOST = 'getbrewpath.com';
export const SITE_URL = `https://${SITE_HOST}`;

/** The App Store listing's id. Null until the listing exists. Set it at launch. */
export const APP_STORE_ID: string | null = null;
/** The App Store listing. Until `APP_STORE_ID` is set, a placeholder address that leads nowhere. */
export const APP_STORE_URL = `https://apps.apple.com/app/brewpath/id${APP_STORE_ID ?? '0000000000'}`;

export const EMAIL_HI = 'hi@getbrewpath.com';
/** The link address that opens a new email to `email`. */
export const mailtoHref = (email: string) => `mailto:${email}`;
export const SUPPORT_MAILTO = mailtoHref(EMAIL_HI);
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
 * The app's Apple team and bundle id, which the universal-link file names.
 * Source: brewpath repo, docs/universal-links-setup.md.
 */
export const APPLE_APP_ID = '597GQ84U66.dev.maximsan.brewPath';

/** The year the site was first published, for the footer. */
export const COPYRIGHT_YEAR = 2026;
