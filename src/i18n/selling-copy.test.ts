import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { SELLING_MODELS } from '@domains/selling/selling';
import { EMAIL_HI } from '@domains/site/site';

import { messageEntries } from './message-entries';
import { MESSAGES } from './messages';
import { routing } from './routing';

describe.each(routing.locales)('%s selling copy', (locale) => {
  it('words each selling-model line differently for each selling model', async () => {
    const messages = await MESSAGES[locale]();
    const t = createTranslator({ locale, messages });
    const keys = messageEntries(messages)
      .filter(([, text]) => text.includes('{model, select'))
      .map(([key]) => key);

    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      const versions = SELLING_MODELS.map((model) =>
        // Keys are read from the messages themselves, which TypeScript cannot follow.
        t(key as Parameters<typeof t>[0], { model, email: EMAIL_HI }),
      );
      expect(new Set(versions).size, key).toBe(SELLING_MODELS.length);
    }
  });
});
