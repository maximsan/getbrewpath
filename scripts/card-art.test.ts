import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { artPalette, renderCardArt } from './card-art';

const source =
  '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="#FE0006"/><text x="50" y="90" text-anchor="middle" font-size="10" font-family="monospace">{fine}</text></svg>';
const palette = artPalette(readFileSync('src/app/globals.css', 'utf8'), 'cupping');

describe('card artwork import', () => {
  it('resolves sentinel colors and escaped words into a standalone SVG image', () => {
    const svg = renderCardArt(source, { fine: 'FINE & <EVEN>' }, palette);

    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain(`fill="${palette['--accent']}"`);
    expect(svg).toContain('FINE &amp; &lt;EVEN&gt;');
    expect(svg).not.toMatch(/#FE\d{4}|\{fine\}/);
  });

  it('uses the matching mood from the single CSS palette source', () => {
    const css = readFileSync('src/app/globals.css', 'utf8');

    expect(artPalette(css, 'dark-roast')['--accent']).not.toBe(palette['--accent']);
    expect(artPalette(css, 'dark-roast')['--art-cream']).toBe(palette['--art-cream']);
    expect(palette['--surface-2']).toMatch(/^#[\da-f]{6}$/i);
  });

  it('fits a long translated word within its drawing rather than clipping it', () => {
    const svg = renderCardArt(source, { fine: 'A'.repeat(50) }, palette);
    const size = /font-size="([\d.]+)"/.exec(svg)?.[1];

    expect(Number(size)).toBeGreaterThan(0);
    expect(Number(size)).toBeLessThan(10);
  });

  it('fails on a missing word or unknown sentinel instead of drawing placeholders', () => {
    expect(() => renderCardArt(source, {}, palette)).toThrow('fine');
    expect(() =>
      renderCardArt(source.replace('#FE0006', '#FE0099'), { fine: 'Fine' }, palette),
    ).toThrow('sentinel');
  });

  it.each([
    '<script>alert(1)</script>',
    '<foreignObject><div>content</div></foreignObject>',
    '<image href="https://example.com/tracker.png"/>',
    '<circle onload="alert(1)"/>',
    '<circle style="fill:url(https://example.com/image)"/>',
    '<g clip-path="url(https://example.com/image)"/>',
    '<!DOCTYPE svg [<!ENTITY word SYSTEM "file:///etc/passwd">]>',
    '<circle cx="1" cx="2"/>',
    '<text>A & B</text>',
    '<g></g/>',
    '</svg><svg>',
  ])('rejects active content, external references and declarations: %s', (content) => {
    expect(() =>
      renderCardArt(`<svg viewBox="0 0 100 100">${content}</svg>`, {}, palette),
    ).toThrow();
  });

  it('preserves translated text that resembles a sentinel color', () => {
    expect(renderCardArt(source, { fine: '#FE0006' }, palette)).toContain('>#FE0006</text>');
  });
});
