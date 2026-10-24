import site from '@messages/en/site.json';
import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';

/**
 * The copy takes the free lesson count and the daily limit as placeholders.
 * It spells a count up to three out and shows a larger one as digits.
 */
describe('the free lesson copy', () => {
  const t = createTranslator({ locale: 'en', messages: site });

  it('spells a small count out', () => {
    expect(t('pricing.freeList.item1', { freeLessons: 3 })).toBe('The first three lessons');
    expect(t('faq.items.q1.a', { freeLessons: 3, freeDailyActivities: 2 })).toMatch(
      /^The first three lessons and the practice games they teach are free, up to two lessons or games a day\. /,
    );
    expect(t('demo.fullLesson', { freeLessons: 3 })).toBe(
      'The full lesson is eight cards — and one of the three free ones.',
    );
  });

  it('uses the singular when one lesson is free', () => {
    expect(t('pricing.freeList.item1', { freeLessons: 1 })).toBe('The first lesson');
    expect(t('demo.fullLesson', { freeLessons: 1 })).toBe(
      'The full lesson is eight cards — and the free one.',
    );
  });

  it('shows a count past three as digits', () => {
    expect(t('pricing.freeList.item1', { freeLessons: 4 })).toBe('The first 4 lessons');
    expect(t('demo.fullLesson', { freeLessons: 4 })).toBe(
      'The full lesson is eight cards — and one of the 4 free ones.',
    );
  });
});
