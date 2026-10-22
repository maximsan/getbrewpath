import { expect, type Page, test } from '@playwright/test';

import course from '@content/en/course.json' with { type: 'json' };
import site from '@messages/en/site.json' with { type: 'json' };
import { LEGAL_DOCS, type LegalDocId } from '@domains/site/legal-docs';
import { PAGE_ROUTES } from '@domains/site/routes';
import { APP_STORE_URL, EMAIL_HI, EMAIL_PRESS, EMAIL_SUPPORT } from '@domains/site/site';

const SITE_EMAIL_LINKS = [EMAIL_HI, EMAIL_PRESS, EMAIL_SUPPORT].map((email) => `mailto:${email}`);

const firstCard = course.cards[0];
if (!firstCard) throw new Error('The course has no cards; run pnpm sync-cards');
const CARD_PAGE = `/card/${firstCard.id}`;
const UNKNOWN_PAGE = '/no-such-page';

/** The `href` of each link on the page that `selector` matches. */
const linkTargets = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll((links) => links.map((link) => link.getAttribute('href')));

test('home page shows both phone mock-ups', async ({ page }) => {
  await page.goto(PAGE_ROUTES.home);
  // `useFitScale` shrinks each phone mock-up to fit its box. The phone's
  // screen stays hidden until the hook has measured that box.
  const introPhone = page.getByRole('img', { name: site.features.items.mood.alt });
  await expect(introPhone.getByText(site.features.introCue)).toBeVisible();
  await expect(page.getByText(site.demo.card0.prompt)).toBeVisible();
});

for (const doc of Object.keys(LEGAL_DOCS) as LegalDocId[]) {
  test(`${doc} page shows its heading and contact address`, async ({ page }) => {
    const response = await page.goto(PAGE_ROUTES[doc]);
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.docs[doc].title);
    await expect(page.locator(`a[href="mailto:${LEGAL_DOCS[doc].email}"]`).first()).toBeVisible();
  });
}

test('a Coffee Card page shows its card', async ({ page }) => {
  await page.goto(CARD_PAGE);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(firstCard.reward.title);
});

test('an unknown address shows the 404 page', async ({ page }) => {
  const response = await page.goto(UNKNOWN_PAGE);
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.notfound.title);
});

for (const path of [...Object.values(PAGE_ROUTES), CARD_PAGE, UNKNOWN_PAGE]) {
  test(`links on ${path} point at the site's addresses`, async ({ page }) => {
    await page.goto(path);

    const emailLinks = await linkTargets(page, 'a[href^="mailto:"]');
    expect(emailLinks.length, 'email links').toBeGreaterThan(0);
    for (const href of emailLinks) expect(SITE_EMAIL_LINKS).toContain(href);

    const appStoreLinks = await linkTargets(page, 'a[href*="apps.apple.com"]');
    expect(appStoreLinks.length, 'App Store links').toBeGreaterThan(0);
    for (const href of appStoreLinks) expect(href).toBe(APP_STORE_URL);
  });
}
