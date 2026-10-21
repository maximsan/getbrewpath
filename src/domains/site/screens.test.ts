import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { MOODS } from './mood';
import { SCREENS, screenSrc } from './screens';

describe.each(MOODS)('the %s screenshots', (mood) => {
  it.each(SCREENS)('include %s', (screen) => {
    expect(existsSync(join('public', screenSrc(screen, mood)))).toBe(true);
  });
});
