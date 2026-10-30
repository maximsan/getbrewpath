import { describe, expect, it } from 'vitest';

import { APP_STORE_ID, APP_STORE_URL } from './site';

describe('BrewPath App Store destination', () => {
  it('uses the app record supplied by the owner instead of the setup placeholder', () => {
    expect(APP_STORE_ID).toBe('6827754824');
    expect(APP_STORE_URL).toBe('https://apps.apple.com/app/brewpath/id6827754824');
  });
});
