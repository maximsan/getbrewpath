import site from '@messages/en/site.json' with { type: 'json' };

import { expect, test } from './fixtures';
import { openPath } from './helpers';

const CARD_IDS = ['c1', 'c-m2l5', 'cM2'];
const TEXT_SCALE = 2;

test.use({ viewport: { width: 320, height: 900 }, reducedMotion: 'reduce' });

for (const cardId of CARD_IDS) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`${cardId}: doubled text fits a narrow phone in ${colorScheme} mood`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await openPath(page, `/card/${cardId}`);
      await expect(
        page.getByRole('button', { name: site.nav.moodDark, exact: true }),
      ).toHaveAttribute('aria-pressed', String(colorScheme === 'dark'));
      await page.evaluate(() => document.fonts.ready);
      const heading = page.getByRole('heading', { level: 1 });
      const originalSize = await heading.evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize),
      );

      // Freeze sizes in a stylesheet: hydration may replace inline DOM attributes.
      const enlargedText = await page.evaluate(
        (scale) =>
          [...document.body.querySelectorAll('*')]
            .filter((element): element is HTMLElement => element instanceof HTMLElement)
            .map((element) => {
              const size = parseFloat(getComputedStyle(element).fontSize);
              const path: string[] = [];
              let current: Element | null = element;

              while (current && current !== document.body) {
                const parent: HTMLElement = current.parentElement!;
                const position = [...parent.children].indexOf(current) + 1;

                path.unshift(`${current.localName}:nth-child(${position})`);
                current = parent;
              }

              return `body > ${path.join(' > ')} { font-size: ${size * scale}px !important; }`;
            })
            .join('\n'),
        TEXT_SCALE,
      );

      await page.addStyleTag({ content: enlargedText });
      expect(
        await heading.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
      ).toBe(originalSize * TEXT_SCALE);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
      const clipped = await page.getByRole('main').evaluate((main) =>
        [...main.querySelectorAll('h1, h2, p, dt, dd, a')]
          .filter(
            (element) => getComputedStyle(element).display !== 'inline' && element.clientWidth > 0,
          )
          .filter(
            (element) =>
              element.scrollWidth > element.clientWidth + 1 ||
              (['hidden', 'clip'].includes(getComputedStyle(element).overflowY) &&
                element.scrollHeight > element.clientHeight + 1),
          )
          .map((element) => element.textContent),
      );

      expect(clipped).toEqual([]);
    });
  }
}

test('skip navigation transfers keyboard focus into each Coffee Card', async ({ page }) => {
  for (const cardId of CARD_IDS) {
    await openPath(page, `/card/${cardId}`);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: site.nav.skip, exact: true });

    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('main').getByRole('link', { name: site.card.get, exact: true }),
    ).toBeFocused();
  }
});
