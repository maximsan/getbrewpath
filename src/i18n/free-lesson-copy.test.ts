import site from '@messages/en/site.json';
import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';

/**
 * The copy takes the free lesson count and the daily limit as placeholders.
 * It spells a count up to three out and shows a larger one as digits.
 */
describe('the free lesson copy', () => {
  const translate = createTranslator({ locale: 'en', messages: site });

  it('spells a small count out', () => {
    expect(translate('pricing.freeList.item1', { freeLessons: 3 })).toBe('The first three lessons');
    expect(translate('faq.items.q1.a', { freeLessons: 3, freeDailyActivities: 2 })).toMatch(
      /^The first three lessons and their practice games are free\. You can complete up to two lessons or games a day\. /,
    );
  });

  it('uses the singular when one lesson is free', () => {
    expect(translate('pricing.freeList.item1', { freeLessons: 1 })).toBe('The first lesson');
  });

  it('shows a count past three as digits', () => {
    expect(translate('pricing.freeList.item1', { freeLessons: 4 })).toBe('The first 4 lessons');
  });
});
