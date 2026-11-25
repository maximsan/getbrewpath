import site from '@messages/en/site.json' with { type: 'json' };
import lesson from '@messages/en/lesson.json' with { type: 'json' };
import { LEGAL_PAGES, PAGE_ROUTES } from '@domains/site/routes';
import { legalPageSource } from '@domains/site/legal-pages';
import { APP_STORE_LIVE, MAILTO_HI } from '@domains/site/site';
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
    browserName,
  }) => {
    await page.clock.install();
    await openPath(page, '/#demo');
    const demo = page.locator('#demo');
    const next = demo.getByRole('button', { name: lesson.continue, exact: true });
    const staysAboveHomeIndicator = async (button: typeof next) => {
      await expect
        .poll(() =>
          button.evaluate((element) => {
            const indicator = element.closest('#demo')?.querySelector('[data-demo-home-indicator]');

            return (
              indicator !== undefined &&
              indicator !== null &&
              element.getBoundingClientRect().bottom < indicator.getBoundingClientRect().top
            );
          }),
        )
        .toBe(true);
    };
    const finish = async (firstAnswer: string) => {
      const answers = [firstAnswer, lesson.false, site.demo.card2.choices.c2];
      const nextQuestions = [site.demo.card1.statement, site.demo.card2.prompt];

      for (const [index, answer] of answers.entries()) {
        await expect(next).toBeDisabled();
        // Choice labels include a decorative answer letter, so match their text suffix.
        const selected = demo.getByRole('button', { name: new RegExp(`${answer}$`) });

        await selected.press('Enter');
        await expect(selected).toHaveAttribute('aria-pressed', 'true');
        await expect(selected).toHaveAttribute('aria-disabled', 'true');
        await selected.press('Enter');
        await expect(next).toBeEnabled();
        await staysAboveHomeIndicator(next);
        const nextQuestion = nextQuestions[index];

        if (!nextQuestion) {
          await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
        }
        await next.press('Enter');

        if (nextQuestion) {
          await expect(demo.getByRole('heading', { name: nextQuestion })).toBeFocused();
        }
      }
    };

    await finish(perfect ? site.demo.card0.choices.c2 : site.demo.card0.choices.c1);
    const celebration = demo.getByRole('button', { name: site.demo.continueToResult });

    await expect(celebration).toBeFocused();
    await expect(demo.getByRole('heading', { name: 'The Coffee Cherry', exact: true })).toHaveCount(
      0,
    );
    await celebration.press('Enter');
    await page.clock.resume();
    const score = demo.getByText(
      perfect ? '3 of 3. That card is yours.' : '2 of 3. Get every answer right to earn the card.',
      { exact: true },
    );

    await expect(score).toBeFocused();
    if (!perfect) {
      const replay = demo.getByRole('button', { name: site.demo.again, exact: true });
      const availability = APP_STORE_LIVE
        ? demo.getByRole('link', { name: site.demo.get, exact: true })
        : demo.getByText(site.availability.comingSoon, { exact: true });
      const desktop = page.viewportSize()!;

      for (const width of [320, 390, 600, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        if (width < 600) {
          await expect
            .poll(() =>
              replay.evaluate((button) => {
                const row = button.parentElement!;
                const panel = row.parentElement!;
                const padding = getComputedStyle(panel);
                const contentWidth =
                  panel.clientWidth -
                  parseFloat(padding.paddingLeft) -
                  parseFloat(padding.paddingRight);

                return Math.abs(button.getBoundingClientRect().width - contentWidth);
              }),
            )
            .toBeLessThan(1);
        }
        await expect
          .poll(
            async () => {
              const [status, action] = await Promise.all([
                availability.boundingBox(),
                replay.boundingBox(),
              ]);

              return (
                !!status &&
                !!action &&
                Math.abs(status.width - action.width) < 1 &&
                Math.abs(status.height - action.height) < 1 &&
                (width < 600
                  ? Math.abs(status.x - action.x) < 1 && status.y + status.height <= action.y
                  : Math.abs(status.y - action.y) < 1 && status.x + status.width <= action.x) &&
                status.x >= 0 &&
                action.x + action.width <= width
              );
            },
            { message: `Equal result controls at ${width}px` },
          )
          .toBe(true);
      }
      await page.setViewportSize(desktop);
    }
    const reward = demo.getByRole('heading', { name: 'The Coffee Cherry', exact: true });

    await expect(reward).toBeVisible();

    const fact = demo.getByText('Cherries ripen unevenly on the same branch', { exact: false });

    await expect(fact).toHaveCount(perfect ? 1 : 0);
    await expect(demo.getByText('Not yet earned', { exact: true })).toHaveCount(perfect ? 0 : 1);
    await expect(demo.getByRole('img', { name: 'Illustration: The Coffee Cherry' })).toBeVisible();
    if (!perfect) {
      const retry = demo.getByRole('button', { name: 'Try again', exact: true });

      await staysAboveHomeIndicator(retry);
      await retry.click();
    } else {
      const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
      const card = demo.getByRole('region', { name: 'The Coffee Cherry' });

      await expect(demo.getByText('Scroll to read the full card')).toBeVisible();
      if (APP_STORE_LIVE) {
        await page.keyboard.press(tab);
        await expect(demo.getByRole('link', { name: site.demo.get, exact: true })).toBeFocused();
      }
      await page.keyboard.press(tab);
      await expect(demo.getByRole('button', { name: site.demo.again, exact: true })).toBeFocused();
      await page.keyboard.press(tab);
      await expect(
        demo.getByRole('button', { name: site.demo.restart, exact: true }),
      ).toBeFocused();
      await page.keyboard.press(tab);
      await expect(card).toBeFocused();
      await expect(card).toHaveCSS('scrollbar-width', 'none');
      await page.keyboard.press('End');
      await expect(fact).toBeInViewport({ ratio: 0.99 });
      await demo.getByRole('button', { name: site.demo.again, exact: true }).click();
    }
    await expect(demo.getByRole('heading', { name: site.demo.card0.prompt })).toBeFocused();
    await finish(perfect ? site.demo.card0.choices.c1 : site.demo.card0.choices.c2);
    await expect(celebration).toBeFocused();
    const restart = demo.getByRole('button', { name: site.demo.restart, exact: true });

    await restart.focus();
    await page.clock.runFor(2000);
    await page.clock.resume();
    await expect(
      demo.getByText(
        perfect
          ? '2 of 3. Get every answer right to earn the card.'
          : '3 of 3. That card is yours.',
        { exact: true },
      ),
    ).toBeVisible();
    await expect(restart).toBeFocused();
    await restart.click();
    await expect(demo.getByRole('heading', { name: site.demo.card0.prompt })).toBeFocused();
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

for (const doc of LEGAL_PAGES) {
  test(`${doc}: contents links and PDF downloads reach the actual document`, async ({
    page,
    request,
  }) => {
    await openPath(page, PAGE_ROUTES[doc]);
    const contents = page.getByRole('navigation', { name: site.docs.contents });
    const links = contents.getByRole('link');

    expect(await links.count()).toBeGreaterThan(0);
    for (const link of await links.all()) {
      const target = await link.getAttribute('href');

      expect(target).toMatch(/^#doc-/);
      await link.click();
      await expect(page).toHaveURL(`${PAGE_ROUTES[doc]}${target}`);
      await expect(page.locator(target!)).toBeInViewport();
    }

    const source = legalPageSource(doc);
    const download = page.getByRole('link', { name: site.docs.download, exact: true });

    if (source.file) {
      await expect(download).toHaveAttribute('download', '');
      await expect(download).toHaveAttribute('href', source.file);
      const pdf = await request.get(source.file);

      expect(pdf.status()).toBe(200);
      expect(pdf.headers()['content-type']).toContain('application/pdf');
      expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
    } else {
      await expect(download).toHaveCount(0);
    }
  });
}

test('phone menu legal links close the menu and support links use email', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPath(page, '/');
  const menu = page.getByRole('button', { name: site.nav.menu, exact: true });

  for (const doc of LEGAL_PAGES) {
    await menu.click();
    const navigation = page.getByRole('navigation', { name: site.nav.primary });

    await expect(navigation.locator('a[href^="mailto:"]')).toHaveAttribute('href', MAILTO_HI);
    await navigation.getByRole('link', { name: site.footer[doc], exact: true }).click();
    await expect(page).toHaveURL(PAGE_ROUTES[doc]);
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('main')).toHaveJSProperty('inert', false);
  }
});
