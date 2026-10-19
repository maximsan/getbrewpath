import { describe, expect, it } from 'vitest';

import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  it('allows up to the limit inside one window', () => {
    const allow = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect([allow('a', 0), allow('a', 10), allow('a', 20)]).toEqual([true, true, false]);
  });

  it('counts each key separately', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect([allow('a', 0), allow('b', 0)]).toEqual([true, true]);
  });

  it('starts a new window once the old one has passed', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    allow('a', 0);
    expect(allow('a', 1000)).toBe(true);
  });
});
