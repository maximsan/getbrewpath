import { describe, expect, it } from 'vitest';

import { overlayTranslation } from './overlay-translation';

// Records shaped like the app's modules bank: assets/content/generated/modules.json
// and its Belarusian folder, assets/content/l10n/be/modules.json.
const beansModule = {
  id: 'm1',
  n: 1,
  title: 'Beans',
  lessons: [{ id: 'm1l1', title: 'What coffee actually is' }],
};

describe('overlayTranslation', () => {
  it('keeps English for every field the translation leaves out', () => {
    const [merged] = overlayTranslation(
      [beansModule],
      [{ id: 'm1', title: 'Зерны', lessons: [{ title: 'Што такое кава на самай справе' }] }],
      'modules',
    );
    expect(merged).toEqual({
      id: 'm1',
      n: 1,
      title: 'Зерны',
      lessons: [{ id: 'm1l1', title: 'Што такое кава на самай справе' }],
    });
  });

  it('drops the translatedFrom and nativeReviewed bookkeeping fields', () => {
    const [merged] = overlayTranslation(
      [beansModule],
      [{ id: 'm1', title: 'Зерны', translatedFrom: { title: 'Beans' } }],
      'modules',
    );
    expect(merged).not.toHaveProperty('translatedFrom');
  });

  it('throws on a field English lacks', () => {
    expect(() =>
      overlayTranslation([beansModule], [{ id: 'm1', titel: 'Зерны' }], 'modules'),
    ).toThrow(/titel/);
  });

  it('throws on a list shorter than English', () => {
    expect(() => overlayTranslation([beansModule], [{ id: 'm1', lessons: [] }], 'modules')).toThrow(
      /lists 0 where English lists 1/,
    );
  });

  it('throws on an id English no longer has', () => {
    expect(() =>
      overlayTranslation([beansModule], [{ id: 'm9', title: 'Зерны' }], 'modules'),
    ).toThrow(/m9/);
  });
});
