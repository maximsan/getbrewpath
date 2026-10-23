import site from '@messages/en/site.json';
import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';

/**
 * The free lesson count and the daily limit come from the course summary.
 * The copy spells a small count out and shows a larger one as digits.
 */
describe('the free lesson copy', () => {
  const t = createTranslator({ locale: 'en', messages: site });

  it('spells a small count out', () => {
    expect(t('pricing.title', { freeLessons: 3 })).toBe(
      'The first three lessons are free. Foundations unlocks the rest.',
    );
    expect(t('pricing.freeList.item1', { freeLessons: 3 })).toBe('The first three lessons');
    expect(t('faq.items.q1.a', { freeLessons: 3, freeDailyActivities: 2 })).toMatch(
      /^The first three lessons and the practice games they teach are free, up to two a day\. /,
    );
  });

  it('reads as one sentence for a single lesson', () => {
    expect(t('pricing.title', { freeLessons: 1 })).toBe(
      'The first lesson is free. Foundations unlocks the rest.',
    );
  });

  it('shows a larger count as digits', () => {
    expect(t('pricing.title', { freeLessons: 12 })).toBe(
      'The first 12 lessons are free. Foundations unlocks the rest.',
    );
  });

  it('names the free lessons in a module row only when it has some', () => {
    expect(t('modules.lessons', { n: 7, free: 3 })).toBe('7 lessons, 3 free');
    expect(t('modules.lessons', { n: 6, free: 0 })).toBe('6 lessons');
  });
});
