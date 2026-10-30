import { XMLSerializer } from '@xmldom/xmldom';
import type { Font } from 'opentype.js';

import { parseDrawing } from './card-art';

const OUTLINE_DECIMALS = 4;
const PAINT_ATTRIBUTES = [
  'fill',
  'stroke',
  'stroke-width',
  'opacity',
  'fill-opacity',
  'stroke-opacity',
  'transform',
  'id',
  'clip-path',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
];

/** Outline text with the app's actual font files so standalone SVGs need no browser fonts. */
export function outlineCardArt(svg: string, fonts: Record<string, Font>) {
  const document = parseDrawing(svg);

  for (const text of Array.from(document.getElementsByTagName('text'))) {
    const family = text.getAttribute('font-family') ?? '';
    const italic = text.getAttribute('font-style') === 'italic';
    const font = fonts[italic ? `${family}:italic` : family];
    const content = text.textContent ?? '';

    if (!font) {
      throw new Error(`Missing artwork font ${family}`);
    }
    if (Array.from(content).some((character) => !font.hasChar(character))) {
      throw new Error(`Missing artwork glyph in ${family}`);
    }
    const size = Number(text.getAttribute('font-size'));
    const spacing = Number(text.getAttribute('letter-spacing') ?? 0);
    const options = { letterSpacing: spacing / size, variation: { opsz: size } };

    // Variable fonts apply optical-size metrics lazily during path generation.
    // Initialize them before measuring so both moods use the same anchor.
    font.getPath(content, 0, 0, size, options);

    const advance = font.getAdvanceWidth(content, size, options);
    const anchor = text.getAttribute('text-anchor');
    const offset = anchor === 'middle' ? advance / 2 : anchor === 'end' ? advance : 0;
    const startX = Number(text.getAttribute('x') ?? 0) - offset;
    const baselineY = Number(text.getAttribute('y') ?? 0);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    path.setAttribute(
      'd',
      font.getPath(content, startX, baselineY, size, options).toPathData(OUTLINE_DECIMALS),
    );
    for (const attribute of PAINT_ATTRIBUTES) {
      const value = text.getAttribute(attribute);

      if (value !== null) {
        path.setAttribute(attribute, value);
      }
    }
    text.parentNode!.replaceChild(path, text);
  }

  return new XMLSerializer().serializeToString(document);
}
