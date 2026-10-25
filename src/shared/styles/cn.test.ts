import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { cn, TEXT_SIZES } from './cn';

/** A `--text-*` size token, without the `--text-*--line-height` and similar companions. */
const TEXT_SIZE_TOKEN = /^\s*--text-(?<size>[a-z0-9-]+?)\s*:/gm;
const themeTextSizes = [...readFileSync('src/app/globals.css', 'utf8').matchAll(TEXT_SIZE_TOKEN)]
  .map((match) => match.groups?.size ?? '')
  .filter((size) => !size.includes('--'));

describe('cn', () => {
  it('knows exactly the text sizes globals.css defines', () => {
    expect(TEXT_SIZES.toSorted()).toEqual(themeTextSizes.toSorted());
  });

  it.each(TEXT_SIZES)('keeps the text-%s size beside a text colour', (size) => {
    const textSize = `text-${size}`;

    expect(cn(textSize, 'text-ink')).toBe(`${textSize} text-ink`);
  });

  it('keeps the later of two text sizes', () => {
    expect(cn('text-body', 'text-label')).toBe('text-label');
  });
});
