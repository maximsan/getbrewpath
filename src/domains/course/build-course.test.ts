import { describe, expect, it } from 'vitest';

import { buildCourse } from './build-course';

/** Real entries from the app's generated lessons, modules and collectibles files. */
const coffeeCherry = {
  title: 'The Coffee Cherry',
  summary: 'The fruit of the coffee plant. Two seeds inside each one.',
  fact: 'Cherries ripen unevenly on the same branch — pickers return three or four times.',
  meta: [['FAMILY', 'Rubiaceae']],
};
const beanBelt = {
  title: 'The Bean Belt',
  summary: 'The equatorial band where coffee grows — and why place ends up in the cup.',
  fact: 'The same variety planted in two countries can taste completely different. Origin does the talking.',
  meta: [['LATITUDE', '25°N – 25°S']],
};
const beansGuide = {
  title: 'Beans Field Guide',
  summary: 'Arabica or Robusta, where it grew, how it was processed.',
  fact: 'That coffee bag isn’t just labels anymore — you know what they mean.',
  badge: 'BEANS · COMPLETE',
};

const banks = {
  lessons: {
    items: [
      { id: 'm1l1', title: 'What coffee actually is', reward: coffeeCherry },
      { id: 'm1l3', title: 'What origin means', reward: beanBelt },
    ],
  },
  modules: {
    items: [
      {
        id: 'm1',
        n: 1,
        title: 'Beans',
        lessons: [{ id: 'm1l1' }, { id: 'm1l2' }, { id: 'm1l3' }],
        reward: beansGuide,
      },
    ],
  },
  collectibles: {
    items: [
      { id: 'c1', unlock: { lesson: 'm1l1' } },
      { id: 'c2', unlock: { lesson: 'm1l3' } },
      { id: 'cM1', unlock: { module: 'm1' } },
    ],
  },
};

describe('buildCourse', () => {
  it('counts the lessons of each module', () => {
    expect(buildCourse(banks).modules).toEqual([
      { id: 'm1', number: 1, title: 'Beans', lessonCount: 3 },
    ]);
  });

  it('places a lesson card inside its module', () => {
    expect(buildCourse(banks).cards[1]).toEqual({
      id: 'c2',
      source: 'lesson',
      reward: beanBelt,
      moduleNumber: 1,
      moduleTitle: 'Beans',
      lessonTitle: 'What origin means',
      lessonNumber: 3,
    });
  });

  it('gives a field guide its module reward', () => {
    expect(buildCourse(banks).cards[2]).toEqual({
      id: 'cM1',
      source: 'module',
      reward: beansGuide,
      moduleNumber: 1,
      moduleTitle: 'Beans',
    });
  });

  it('fails when a card unlocks from a lesson that does not exist', () => {
    const broken = {
      ...banks,
      collectibles: { items: [{ id: 'c9', unlock: { lesson: 'm9l9' } }] },
    };
    expect(() => buildCourse(broken)).toThrow('Card c9');
  });
});
