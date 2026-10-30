import { DOMParser } from '@xmldom/xmldom';

/** Imports the app's small drawing-only SVG format, not arbitrary SVG documents. */
const SENTINELS: Record<string, string> = {
  FE0001: '--ink',
  FE0002: '--ink-mute',
  FE0003: '--rule',
  FE0004: '--surface',
  FE0005: '--surface-2',
  FE0006: '--accent',
  FE0007: '--sage',
  FE0008: '--berry',
  FE0011: '--art-cream',
  FE0012: '--art-ripe',
  FE0013: '--art-sour',
  FE0014: '--art-roast-light',
  FE0015: '--art-roast-mid',
  FE0016: '--art-roast-dark',
  FE0017: '--art-seed-crease',
  FE0018: '--art-hairline',
  FE0021: '--art-cherry-skin',
  FE0022: '--art-cherry-pulp',
  FE0023: '--art-cherry-gel',
  FE0024: '--art-cherry-parchment',
  FE0025: '--art-cherry-silverskin',
  FE0026: '--art-cherry-seed',
};

const ELEMENTS = new Set([
  'svg',
  'g',
  'path',
  'circle',
  'ellipse',
  'rect',
  'line',
  'text',
  'defs',
  'clipPath',
]);
const ATTRIBUTES = new Set(
  'viewBox d fill stroke stroke-width stroke-linecap fill-opacity stroke-linejoin opacity cx cy r rx ry stroke-dasharray x y font-size font-family width height text-anchor font-style letter-spacing x1 y1 x2 y2 transform stroke-opacity id clip-path'.split(
    ' ',
  ),
);

export function artPalette(css: string, mood: 'cupping' | 'dark-roast') {
  const root = /:root\s*\{([^}]+)\}/.exec(css)?.[1] ?? '';
  const dark = /\[data-mood='dark-roast'\]\s*\{([^}]+)\}/.exec(css)?.[1] ?? '';

  return Object.fromEntries(
    [
      ...`${root}${mood === 'dark-roast' ? dark : ''}`.matchAll(
        /(--[a-z\d-]+):\s*(#[a-f\d]{6});/gi,
      ),
    ].map((match) => [match[1]!, match[2]!]),
  );
}

export function parseDrawing(svg: string) {
  if (/<[!?]/.test(svg) || /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/i.test(svg)) {
    throw new Error('Unsupported card drawing declaration or entity');
  }
  const document = new DOMParser({
    onError: () => {
      throw new Error('Malformed card drawing XML');
    },
  }).parseFromString(svg, 'image/svg+xml');
  const root = document.documentElement;

  if (!root || root.tagName !== 'svg' || root.getAttribute('viewBox') !== '0 0 100 100') {
    throw new Error('Unexpected card drawing root');
  }
  if (
    Array.from(document.childNodes).filter((node) => node.nodeType === node.ELEMENT_NODE).length !==
    1
  ) {
    throw new Error('Expected one card drawing root');
  }

  return document;
}

function checkDrawing(svg: string) {
  const root = parseDrawing(svg).documentElement!;

  for (const element of [root, ...Array.from(root.getElementsByTagName('*'))]) {
    if (!ELEMENTS.has(element.tagName)) {
      throw new Error('Unsupported card drawing element');
    }
    for (const { name: attribute, value } of Array.from(element.attributes)) {
      if (
        !ATTRIBUTES.has(attribute) ||
        (attribute === 'clip-path' && !/^url\(#[\w-]+\)$/.test(value))
      ) {
        throw new Error('Unsupported card drawing attribute or external reference');
      }
      if (
        (attribute === 'fill' || attribute === 'stroke') &&
        !/^(none|#[a-f\d]{6})$/i.test(value)
      ) {
        throw new Error('Unexpected card drawing paint');
      }
    }
  }
}

const WORD_SLOT = /<text([^>]*)>\{([a-z]+)\}<\/text>/g;
const WORD_EDGE_INSET = 5;
const MONO_ADVANCE = 0.6;
const DRAWING_WIDTH = 100;
const COORDINATE_DECIMALS = 4;
const attributeValue = (attributes: string, name: string) =>
  new RegExp(` ${name}="([^"]*)"`).exec(attributes)?.[1];

/** The app's ADR-0019 fitting rule: words share a line's room and shrink only if necessary. */
function fillWords(svg: string, words: Record<string, string>) {
  const slots = [...svg.matchAll(WORD_SLOT)].map((match) => ({
    attributes: match[1]!,
    id: match[2]!,
    x: Number(attributeValue(match[1]!, 'x') ?? 0),
    y: Number(attributeValue(match[1]!, 'y') ?? 0),
    anchor: attributeValue(match[1]!, 'text-anchor') ?? 'start',
  }));
  let index = 0;

  return svg.replace(WORD_SLOT, () => {
    const slot = slots[index++]!;
    const word = words[slot.id];

    if (!word) {
      throw new Error(`Missing card artwork word ${slot.id}`);
    }
    let left = 0;
    let right = DRAWING_WIDTH;

    for (const other of slots) {
      if (other === slot || other.y !== slot.y) {
        continue;
      }
      if (other.x > slot.x) {
        right = Math.min(right, other.anchor === 'start' ? other.x : (slot.x + other.x) / 2);
      } else if (other.x < slot.x) {
        left = Math.max(left, other.anchor === 'end' ? other.x : (slot.x + other.x) / 2);
      }
    }
    left += WORD_EDGE_INSET;
    right -= WORD_EDGE_INSET;
    const room =
      slot.anchor === 'middle'
        ? 2 * Math.min(slot.x - left, right - slot.x)
        : slot.anchor === 'end'
          ? slot.x - left
          : right - slot.x;
    const fontSize = Number(attributeValue(slot.attributes, 'font-size'));
    const spacing = Number(attributeValue(slot.attributes, 'letter-spacing') ?? 0);
    const drawn = Array.from(word).length * (MONO_ADVANCE * fontSize + spacing);
    const scale = Math.min(1, room / drawn);

    if (!Number.isFinite(scale) || scale <= 0 || !fontSize) {
      throw new Error(`No room for card artwork word ${slot.id}`);
    }
    const fitted = slot.attributes.replace(
      / (font-size|letter-spacing)="([\d.-]+)"/g,
      (_, name: string, value: string) =>
        ` ${name}="${Number((Number(value) * scale).toFixed(COORDINATE_DECIMALS))}"`,
    );
    const escaped = word.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return `<text${fitted}>${escaped}</text>`;
  });
}

export function renderCardArt(
  svg: string,
  words: Record<string, string>,
  palette: Record<string, string>,
) {
  checkDrawing(svg);

  const painted = svg.replace(/#(FE[\dA-F]{4})/gi, (_, sentinel: string) => {
    const color = palette[SENTINELS[sentinel.toUpperCase()] ?? ''];

    if (!color) {
      throw new Error(`Unknown card artwork sentinel ${sentinel}`);
    }

    return color;
  });

  return fillWords(painted, words).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
}
