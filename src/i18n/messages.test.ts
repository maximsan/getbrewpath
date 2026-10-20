import { describe, expect, it } from 'vitest';

import { MESSAGES } from './messages';
import { routing } from './routing';

/** Every string's key path, such as "faq.items.q1.a". */
const keyPaths = (value: unknown, prefix = ''): string[] =>
  typeof value === 'object' && value !== null
    ? Object.entries(value).flatMap(([key, child]) => keyPaths(child, `${prefix}${key}.`))
    : [prefix.slice(0, -1)];

describe('each language’s strings', () => {
  it.each(routing.locales)('%s has exactly the keys English has', async (locale) => {
    const english = keyPaths(await MESSAGES[routing.defaultLocale]()).sort();
    expect(keyPaths(await MESSAGES[locale]()).sort()).toEqual(english);
  });
});
