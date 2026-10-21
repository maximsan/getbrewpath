/**
 * How Foundations is sold, in the app's own terms.
 * Source: brewpath repo, lib/shared/models/monetization/plus_offering.dart.
 */

import { PLAN_PRICES, SELLING_MODEL } from '@domains/site/site';

/**
 * One-time: buy once, keep it. Subscription: pay monthly or yearly.
 * Hybrid: the learner picks a monthly, yearly or one-time plan.
 */
export const SELLING_MODELS = ['oneTime', 'subscription', 'hybrid'] as const;
export type SellingModel = (typeof SELLING_MODELS)[number];

/** How long one purchase lasts. */
export const PLAN_TERMS = ['lifetime', 'monthly', 'yearly'] as const;
export type PlanTerm = (typeof PLAN_TERMS)[number];

/** The plans each model offers, in the order the app's paywall lists them. */
export const PLANS: Record<SellingModel, readonly PlanTerm[]> = {
  oneTime: ['lifetime'],
  subscription: ['monthly', 'yearly'],
  hybrid: ['monthly', 'yearly', 'lifetime'],
};

/** The plans on sale under the site's selling model, with their prices. */
export const PLANS_ON_SALE = PLANS[SELLING_MODEL].map((term) => ({
  term,
  price: PLAN_PRICES[term],
}));
