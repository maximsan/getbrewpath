/**
 * How Foundations is sold, in the app's own terms.
 * One-time: buy once, keep it. Subscription: pay monthly or yearly.
 * Hybrid: the learner picks a monthly, yearly or one-time plan.
 * Source: brewpath repo, lib/shared/models/monetization/plus_offering.dart.
 */
export const SELLING_MODELS = ['oneTime', 'subscription', 'hybrid'] as const;
export type SellingModel = (typeof SELLING_MODELS)[number];
