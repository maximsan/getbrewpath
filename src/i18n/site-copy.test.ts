import { describe, expect, it } from 'vitest';

import { messageEntries } from './message-entries';
import { MESSAGES } from './messages';
import { routing } from './routing';

/**
 * Words that name a selling model, taken from the copy the site used to show.
 * See GLOSSARY.md. Only the legal documents name one. Their strings sit under `docs`.
 */
const SELLING_MODEL_WORDS =
  /subscri|one-time|one purchase|buy it once|renew|monthly|yearly|forever|lifetime|cancel anytime/i;

describe.each(routing.locales)('%s site copy', (locale) => {
  it('names no selling model outside the legal documents', async () => {
    const siteCopy = messageEntries(await MESSAGES[locale]()).filter(
      ([key]) => !key.startsWith('docs.'),
    );

    expect(siteCopy.filter(([, text]) => SELLING_MODEL_WORDS.test(text))).toEqual([]);
  });
});
