/** Facts about the product that are not translated: links, mailboxes, dates. */

import type { SellingModel } from '@domains/selling/selling';

export const SITE_URL = 'https://getbrewpath.com';
export const SITE_HOST = 'getbrewpath.com';

/** Placeholder listing until the App Store record exists; swap in the real id at launch. */
export const APP_STORE_URL = 'https://apps.apple.com/app/brewpath/id0000000000';

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
 * The domain whose links the app opens (universal links).
 * iOS opens such a link in the app only when it is tapped on another domain's
 * page. So "Open in the app" points there rather than at this site.
 * Source: brewpath repo, lib/core/config/app_links.dart.
 */
export const APP_LINKS_ORIGIN = 'https://brewpath.maximsan.dev';
export const appCardLink = (cardId: string) => `${APP_LINKS_ORIGIN}/card/${cardId}`;

/**
 * The app's Apple team and bundle id, which the universal-link file names.
 * Source: brewpath repo, docs/universal-links-setup.md.
 */
export const APPLE_APP_ID = '597GQ84U66.dev.maximsan.brewPath';

/** The year the site was first published, for the footer. */
export const COPYRIGHT_YEAR = 2026;
