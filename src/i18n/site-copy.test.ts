import { describe, expect, it } from 'vitest';

import { messageEntries } from './message-entries';
import { MESSAGES } from './messages';
import { routing } from './routing';

/**
 * Words that name how Foundations is sold. The app picks that per learner, so
 * only the Terms of Use and the Privacy Policy, the strings under `docs`, name it.
 */
const BILLING_FORM = /subscri|one-time|buy it once|renew/i;

describe.each(routing.locales)('%s site copy', (locale) => {
  it('names no billing form outside the legal documents', async () => {
    const siteCopy = messageEntries(await MESSAGES[locale]()).filter(
      ([key]) => !key.startsWith('docs.'),
    );

    expect(siteCopy.filter(([, text]) => BILLING_FORM.test(text))).toEqual([]);
  });
});
