import { describe, expect, it } from 'vitest';

import { messageEntries } from './message-entries';
import { MESSAGES } from './messages';
import { routing } from './routing';

const keyPaths = (messages: unknown) => messageEntries(messages).map(([key]) => key);

describe('each language’s strings', () => {
  it.each(routing.locales)('%s has exactly the keys English has', async (locale) => {
    const english = keyPaths(await MESSAGES[routing.defaultLocale]()).sort();

    expect(keyPaths(await MESSAGES[locale]()).sort()).toEqual(english);
  });
});
