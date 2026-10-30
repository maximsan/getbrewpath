import { Font, Glyph, Path } from 'opentype.js';
import { describe, expect, it } from 'vitest';

import { outlineCardArt } from './outline-card-art';

const glyphPath = new Path();

glyphPath.moveTo(0, 0);
glyphPath.lineTo(300, 500);
glyphPath.lineTo(600, 0);
glyphPath.close();
const font = new Font({
  familyName: 'Test',
  styleName: 'Regular',
  unitsPerEm: 1000,
  ascender: 800,
  descender: -200,
  glyphs: [
    new Glyph({ name: '.notdef', advanceWidth: 600, path: new Path() }),
    new Glyph({ name: 'A', unicode: 65, advanceWidth: 600, path: glyphPath }),
  ],
});

font.kerningPairs = {};
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="40" font-family="IBM Plex Mono" font-size="10" text-anchor="middle" fill="#112233">AA</text></svg>';

describe('standalone illustration typography', () => {
  it('converts actual font glyphs to anchored paths, retaining baseline and paint', () => {
    const outlined = outlineCardArt(svg, { 'IBM Plex Mono': font });

    expect(outlined).not.toContain('<text');
    expect(outlined).toContain('fill="#112233"');
    expect(outlined).toMatch(/d="M44 40L47 35L50 40/);
  });

  it('fails for unavailable fonts or glyphs rather than relying on a host fallback', () => {
    expect(() => outlineCardArt(svg, {})).toThrow('font');
    expect(() => outlineCardArt(svg.replace('>AA<', '>Ж<'), { 'IBM Plex Mono': font })).toThrow(
      'glyph',
    );
  });

  it('preserves clipping, IDs and stroke styling while removing font dependencies', () => {
    const styled = svg.replace(
      'fill="#112233"',
      'id="label" clip-path="url(#bounds)" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 3" fill="#112233"',
    );
    const outlined = outlineCardArt(styled, { 'IBM Plex Mono': font });

    for (const attribute of [
      'id="label"',
      'clip-path="url(#bounds)"',
      'stroke-linecap="round"',
      'stroke-linejoin="round"',
      'stroke-dasharray="2 3"',
    ]) {
      expect(outlined).toContain(attribute);
    }
  });
});
