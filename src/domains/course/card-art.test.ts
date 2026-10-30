import { describe, expect, it } from 'vitest';

import drawings from '@content/en/card-art.json';
import courseFile from '@content/en/course.json';

import { courseSchema } from './build-course';
import { cardArtSchema, getCardArtImage } from './card-art';

const course = courseSchema.parse(courseFile);
const artwork = cardArtSchema.parse(drawings);

describe('shipped Coffee Card illustrations', () => {
  it('has a distinct original illustration kind for every one of the 37 cards', () => {
    expect(course.cards).toHaveLength(37);
    expect(new Set(course.cards.map((card) => card.kind)).size).toBe(37);
    expect(Object.keys(artwork).sort()).toEqual(course.cards.map((card) => card.kind).sort());
  });

  it('renders all kinds in both moods without sentinel paints or unfilled words', async () => {
    for (const card of course.cards) {
      for (const mood of ['cupping', 'dark-roast'] as const) {
        const uri = await getCardArtImage('en', card.kind, mood);
        const svg = Buffer.from(uri.split(',')[1]!, 'base64').toString('utf8');

        expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
        expect(svg).not.toMatch(
          /#FE[\dA-F]{4}|\{[a-z]+\}|<text|font-family|<script|<foreignObject|\son\w+=/i,
        );
      }
    }
  });

  it('fails explicitly for an unsupported kind rather than silently substituting a stamp', async () => {
    await expect(getCardArtImage('en', 'missing', 'cupping')).rejects.toThrow('Missing');
  });

  it('keeps identical drawing geometry across moods, changing colors only', () => {
    for (const [kind, drawing] of Object.entries(artwork)) {
      expect(drawing.cupping.replace(/#[\da-f]{6}/gi, '#paint'), kind).toBe(
        drawing['dark-roast'].replace(/#[\da-f]{6}/gi, '#paint'),
      );
    }
  });
});
