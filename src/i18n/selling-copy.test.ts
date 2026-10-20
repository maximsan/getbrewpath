import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { SELLING_MODELS } from '@domains/selling/selling';

import { MESSAGES } from './messages';
import { routing } from './routing';

/** Every string's key path and text, such as ["faq.items.q1.a", "…"]. */
const entries = (value: unknown, prefix = ''): [string, string][] =>
  typeof value === 'object' && value !== null
    ? Object.entries(value).flatMap(([key, child]) => entries(child, `${prefix}${key}.`))
    : [[prefix.slice(0, -1), String(value)]];

describe.each(routing.locales)('%s selling copy', (locale) => {
  it('words every model-dependent line differently for each model', async () => {
    const messages = await MESSAGES[locale]();
    const t = createTranslator({ locale, messages });
    const keys = entries(messages)
      .filter(([, text]) => text.includes('{model, select'))
      .map(([key]) => key);

    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      const versions = SELLING_MODELS.map((model) =>
        // Keys are read from the messages themselves, which TypeScript cannot follow.
        t(key as Parameters<typeof t>[0], { model, email: 'hello@getbrewpath.com' }),
      );
      expect(new Set(versions).size, key).toBe(SELLING_MODELS.length);
    }
  });
});
