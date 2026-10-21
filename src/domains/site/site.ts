/** Facts about the product that are not translated: links, mailboxes, prices, dates. */

import type { PlanTerm, SellingModel } from '@domains/selling/selling';

export const SITE_URL = 'https://getbrewpath.com';
export const SITE_HOST = 'getbrewpath.com';

/** Placeholder listing until the App Store record exists; swap in the real id at launch. */
export const APP_STORE_URL = 'https://apps.apple.com/app/brewpath/id0000000000';

export const EMAIL_HELLO = 'hello@getbrewpath.com';
export const EMAIL_PRESS = 'press@getbrewpath.com';
/** The From line of support emails; its domain must be verified in Resend. */
export const EMAIL_SUPPORT_SENDER = 'BrewPath Support <support@getbrewpath.com>';

export const PRICE_CURRENCY = 'USD';
export const PRICE_FREE = 0;

/** How Foundations is sold right now. Every price line on the site follows it. */
export const SELLING_MODEL: SellingModel = 'oneTime';

/**
 * Each plan's price in `PRICE_CURRENCY`. The two subscription prices are
 * placeholders: the store has not priced them yet (brewpath ADR-0024).
 */
export const PLAN_PRICES: Record<PlanTerm, number> = {
  lifetime: 49.99,
  monthly: 4.99,
  yearly: 29.99,
};

export const MINUTES_PER_LESSON = 3;

/** Shown as "Last updated" on the Terms of Use and Privacy Policy. */
export const LEGAL_DOCS_UPDATED = '2026-10-14';

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
