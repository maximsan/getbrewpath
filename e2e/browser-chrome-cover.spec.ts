import site from '@messages/en/site.json' with { type: 'json' };

import { expect, test } from './fixtures';
import { openPath } from './helpers';

// These checks guard the mitigation's geometry and page behavior. Desktop engines
// do not reproduce Telegram's native WKWebView painting outside its frame.
for (const colorScheme of ['light', 'dark'] as const) {
  test(`browser chrome cover stays above the page in ${colorScheme} mood`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await openPath(page, '/card/c1');
    const cover = page.locator('[data-browser-chrome-cover]');
    const header = page.getByRole('banner');

    await expect(cover).toHaveCount(1);
    await expect(cover).toHaveAttribute('aria-hidden', 'true');
    await expect(cover).toHaveCSS('pointer-events', 'none');
    const scrollEnd = await page.evaluate(() => document.documentElement.scrollHeight);

    for (const offset of [0, 300, 900, scrollEnd]) {
      await page.evaluate((scrollOffset) => window.scrollTo(0, scrollOffset), offset);
      await expect
        .poll(() =>
          cover.evaluate((element) => {
            const rect = element.getBoundingClientRect();

            return { top: rect.top, bottom: rect.bottom, height: rect.height };
          }),
        )
        .toEqual({ top: -200, bottom: 0, height: 200 });
      await expect
        .poll(() => header.evaluate((element) => element.getBoundingClientRect().top))
        .toBe(0);
      await expect(cover).toHaveCSS(
        'background-color',
        await header.evaluate((element) => getComputedStyle(element).backgroundColor),
      );
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: site.nav.skip, exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect
      .poll(() => cover.evaluate((element) => element.getBoundingClientRect().width))
      .toBe(1440);
    await expect
      .poll(() => cover.evaluate((element) => element.getBoundingClientRect().top))
      .toBe(-200);
    const beforeMood = await cover.evaluate((element) => getComputedStyle(element).backgroundColor);
    const nextMood = colorScheme === 'light' ? 'dark' : 'light';

    await header
      .getByRole('button', {
        name: nextMood === 'dark' ? site.nav.moodDark : site.nav.moodLight,
        exact: true,
      })
      .click();
    await expect(page.locator('html')).toHaveAttribute('data-scheme', nextMood);
    await expect
      .poll(() => cover.evaluate((element) => getComputedStyle(element).backgroundColor))
      .not.toBe(beforeMood);
    await expect(cover).toHaveCSS(
      'background-color',
      await header.evaluate((element) => getComputedStyle(element).backgroundColor),
    );
    await page.setViewportSize({ width: 390, height: 844 });
    const menu = header.getByRole('button', { name: site.nav.menu, exact: true });

    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
  });
}
