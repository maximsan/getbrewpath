/** Facts about the product that are not translated: links, mailboxes, dates. */

import type { SellingModel } from '@domains/selling/selling';

export const SITE_HOST = 'getbrewpath.com';
export const SITE_URL = `https://${SITE_HOST}`;

/** The App Store listing's id. Null until the listing exists. Set it at launch. */
export const APP_STORE_ID: string | null = null;
/** The App Store listing. Until `APP_STORE_ID` is set, a placeholder address that leads nowhere. */
export const APP_STORE_URL = `https://apps.apple.com/app/brewpath/id${APP_STORE_ID ?? '0000000000'}`;

export const EMAIL_HI = 'hi@getbrewpath.com';
export const EMAIL_SUPPORT = 'support@getbrewpath.com';
/** The link address that opens a new email to `email`. */
export const mailtoHref = (email: string) => `mailto:${email}`;
export const SUPPORT_MAILTO = mailtoHref(EMAIL_SUPPORT);
/** BrewPath's phone number, as the Terms of Use give it. */
export const PHONE = '+48 571 033 267';

/** How Foundations is sold right now. Every line on the site about buying Foundations follows this setting. */
export const SELLING_MODEL: SellingModel = 'oneTime';

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
