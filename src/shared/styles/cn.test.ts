import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { cn } from './cn';

const TEXT_SIZE_TOKEN = /^\s*--text-(?<size>[a-z]+):/gm;
const textSizes = [...readFileSync('src/app/globals.css', 'utf8').matchAll(TEXT_SIZE_TOKEN)].map(
  (match) => match.groups?.size,
);

describe('cn', () => {
  it.each(textSizes)('keeps the text-%s size beside a text colour', (size) => {
    const sizeClass = `text-${size}`;

    expect(cn(sizeClass, 'text-ink')).toBe(`${sizeClass} text-ink`);
  });

  it('keeps the later of two text sizes', () => {
    expect(cn('text-body', 'text-label')).toBe('text-label');
  });
});
