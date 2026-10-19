import { describe, expect, it } from 'vitest';

import { buildCourse } from './build-course';

const reward = {
  title: 'The Coffee Cherry',
  summary: 'S',
  fact: 'F',
  meta: [['FAMILY', 'Rubiaceae']],
};
const guide = { title: 'Beans Field Guide', summary: 'S', fact: 'F', badge: 'BEANS · COMPLETE' };

const banks = {
  lessons: {
    items: [
      { id: 'm1l1', title: 'What coffee actually is', reward },
      { id: 'm1l2', title: 'Arabica vs Robusta', reward: { ...reward, title: 'Arabica' } },
    ],
  },
  modules: {
    items: [
      { id: 'm1', n: 1, title: 'Beans', lessons: [{ id: 'm1l1' }, { id: 'm1l2' }], reward: guide },
    ],
  },
  collectibles: {
    items: [
      { id: 'c1', unlock: { lesson: 'm1l1' } },
      { id: 'c2', unlock: { lesson: 'm1l2' } },
      { id: 'cM1', unlock: { module: 'm1' } },
    ],
  },
};

describe('buildCourse', () => {
  it('counts the lessons of each module', () => {
    expect(buildCourse(banks).modules).toEqual([
      { id: 'm1', number: 1, title: 'Beans', lessonCount: 2 },
    ]);
  });

  it('places a lesson card inside its module', () => {
    expect(buildCourse(banks).cards[1]).toEqual({
      id: 'c2',
      source: 'lesson',
      reward: { ...reward, title: 'Arabica' },
      moduleNumber: 1,
      moduleTitle: 'Beans',
      lessonTitle: 'Arabica vs Robusta',
      lessonNumber: 2,
    });
  });

  it('gives a field guide its module reward', () => {
    expect(buildCourse(banks).cards[2]).toEqual({
      id: 'cM1',
      source: 'module',
      reward: guide,
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
