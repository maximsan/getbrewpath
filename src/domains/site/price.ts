import type { createFormatter } from 'next-intl';

import { PRICE_CURRENCY } from './site';

type Formatter = ReturnType<typeof createFormatter>;

/** A store price in the site currency; whole amounts drop the cents ("$0", "$49.99"). */
export function formatPrice(format: Formatter, amount: number) {
  const fractionDigits = Number.isInteger(amount) ? 0 : 2;
  return format.number(amount, {
    style: 'currency',
    currency: PRICE_CURRENCY,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
