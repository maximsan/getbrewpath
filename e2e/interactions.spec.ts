import site from '@messages/en/site.json' with { type: 'json' };
import lesson from '@messages/en/lesson.json' with { type: 'json' };
import { NAV_SECTIONS } from '../src/app/components/site-header/nav-items';

import { expect, test } from './fixtures';
import { openPath } from './helpers';

test.use({ reducedMotion: 'reduce' });

test('the home logo preserves the browser action for modified clicks', async ({ page }) => {
  await openPath(page, '/');
  const brand = page.getByRole('banner').getByRole('link', { name: 'BrewPath', exact: true });
  // Check cancellation directly: platform-specific new-tab handling varies by OS.
  const cancelled = await brand.evaluate(
    (element) =>
      !element.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true }),
      ),
  );

  expect(cancelled).toBe(false);
});

test('desktop section links and the hero lesson link reach their sections', async ({ page }) => {
  await openPath(page, '/');
  for (const section of NAV_SECTIONS) {
    await page
      .getByRole('banner')
      .getByRole('link', { name: site.nav[section.label], exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`#${section.id}$`));
    await expect(page.locator(`#${section.id}`)).toBeInViewport();
  }
  await page.getByRole('banner').getByRole('link', { name: 'BrewPath', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.locator('main a[href="/#demo"]').click();
  await expect(page).toHaveURL(/#demo$/);
});

test('phone navigation closes, restores access, and follows every section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPath(page, '/');
  const menu = page.getByRole('button', { name: site.nav.menu, exact: true });

  for (const section of NAV_SECTIONS) {
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page
      .getByRole('navigation', { name: site.nav.primary })
      .getByRole('link', { name: new RegExp(site.nav[section.label]) })
      .click();
    await expect(page).toHaveURL(new RegExp(`#${section.id}$`));
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('main')).toHaveJSProperty('inert', false);
  }
  await menu.click();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.click();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.setViewportSize({ width: 1100, height: 844 });
  await expect(
    page.getByRole('button', { name: site.nav.menu, exact: true, includeHidden: true }),
  ).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('main')).toHaveJSProperty('inert', false);
});

test('the mood switch changes and persists the selected mood', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await openPath(page, '/');
  const mood = page.getByRole('button', { name: site.nav.moodDark, exact: true });
  const light = page.getByRole('button', { name: site.nav.moodLight, exact: true });

  await expect(mood).toHaveAttribute('aria-pressed', 'false');
  await mood.click();
  await expect(page.locator('html')).toHaveAttribute('data-scheme', 'dark');
  await expect(mood).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(mood).toHaveAttribute('aria-pressed', 'true');
  await light.click();
  await expect(page.locator('html')).toHaveAttribute('data-scheme', 'light');
  await expect(light).toHaveAttribute('aria-pressed', 'true');
});

for (const perfect of [true, false]) {
  test(`the lesson demo grades a ${perfect ? 'perfect' : 'partial'} run and resets`, async ({
    page,
  }) => {
    await openPath(page, '/#demo');
    const demo = page.locator('#demo');
    const next = demo.getByRole('button', { name: lesson.continue, exact: true });
    const answers = [
      perfect ? site.demo.card0.choices.c2 : site.demo.card0.choices.c1,
      lesson.false,
      site.demo.card2.choices.c2,
    ];

    for (const answer of answers) {
      await expect(next).toBeDisabled();
      // Choice labels include a decorative answer letter, so match their text suffix.
      const selected = demo.getByRole('button', { name: new RegExp(`${answer}$`) });

      await selected.click();
      await expect(selected).toHaveAttribute('aria-pressed', 'true');
      await expect(selected).toHaveAttribute('aria-disabled', 'true');
      await selected.press('Enter');
      await expect(next).toBeEnabled();
      await next.click();
    }
    await expect(demo).toContainText(perfect ? '3 of 3. That card is yours.' : '2 of 3. Close');
    await expect(demo.getByRole('link', { name: site.demo.get, exact: true })).toHaveAttribute(
      'href',
      'https://apps.apple.com/app/brewpath/id6827754824',
    );
    await demo.getByRole('button', { name: site.demo.again, exact: true }).click();
    await expect(next).toBeDisabled();
    await demo.getByRole('button', { name: new RegExp(`${site.demo.card0.choices.c2}$`) }).click();
    await next.click();
    await demo.getByRole('button', { name: site.demo.restart, exact: true }).click();
    await expect(demo.getByText(site.demo.card0.prompt, { exact: true })).toBeVisible();
    await expect(next).toBeDisabled();
  });
}

test('every FAQ opens, closes and replaces the previous answer', async ({ page }) => {
  await openPath(page, '/#faq');
  const faq = page.locator('#faq');
  let previous: string | undefined;

  for (const item of Object.values(site.faq.items)) {
    const question = faq.getByRole('button', { name: item.q, exact: true });

    await expect(question).toHaveAttribute('aria-expanded', 'false');
    await question.click();
    await expect(question).toHaveAttribute('aria-expanded', 'true');
    const panelId = await question.getAttribute('aria-controls');

    await expect(page.locator(`[id="${panelId}"]`)).toBeVisible();
    if (previous) {
      await expect(faq.getByRole('button', { name: previous, exact: true })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    }
    previous = item.q;
  }
  await faq.getByRole('button', { name: previous!, exact: true }).click();
  await expect(faq.locator('button[aria-expanded="true"]')).toHaveCount(0);
});

test('all mascot moments select their caption and random play selects another', async ({
  page,
}) => {
  await openPath(page, '/');
  const moments = page.getByRole('group', { name: site.roasty.tapMoment });

  for (const key of Object.keys(site.roasty.chips) as (keyof typeof site.roasty.chips)[]) {
    const chip = moments.getByRole('button', { name: site.roasty.chips[key], exact: true });

    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await expect(moments.locator('button[aria-pressed="true"]')).toHaveCount(1);
    await expect(page.getByText(site.roasty.lines[key], { exact: true })).toBeVisible();
  }
  await page.getByRole('button', { name: site.roasty.playMoment }).click();
  await expect(moments.getByRole('button', { name: site.roasty.chips.sleep })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect(moments.getByRole('button', { name: site.roasty.chips.idle })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

test('animated phone-menu navigation completes and can be cancelled safely', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openPath(page, '/');
  const menu = page.getByRole('button', { name: site.nav.menu, exact: true });

  await menu.click();
  await page
    .getByRole('navigation', { name: site.nav.primary })
    .getByRole('link', { name: /Pricing/ })
    .click();
  await expect(page).toHaveURL(/#pricing$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(page.getByRole('main')).toHaveJSProperty('inert', false);
});

test('not-found recovery wakes Roasty and returns to the website', async ({ page }) => {
  await openPath(page, '/missing-card', 404);
  const wake = page.getByRole('button', { name: site.notfound.wakeRoasty });

  await expect(wake.locator('svg text')).toHaveText(['z', 'z', 'z']);
  await wake.click();
  await expect(wake.locator('svg text')).toHaveCount(0);
  await expect(wake.locator('svg text')).toHaveText(['z', 'z', 'z'], { timeout: 4000 });
  await page.getByRole('main').getByRole('link', { name: site.notfound.back, exact: true }).click();
  await expect(page).toHaveURL('/');
});

test('every footer legal link opens the expected document', async ({ page }) => {
  await openPath(page, '/');
  for (const [key, path] of [
    ['terms', '/terms'],
    ['privacy', '/privacy'],
    ['websitePrivacy', '/privacy/website'],
  ] as const) {
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: site.footer[key], exact: true })
      .click();
    await expect(page).toHaveURL(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.docs[key].title);
  }
});
