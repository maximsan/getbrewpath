import { expect, type Page, test } from '@playwright/test';

import course from '@content/en/course.json' with { type: 'json' };
import site from '@messages/en/site.json' with { type: 'json' };
import * as siteFacts from '@domains/site/site';

const { APP_STORE_URL, SITE_HOST } = siteFacts;

/** Every mailbox `site.ts` defines, as a link target. */
const SITE_EMAILS = Object.values(siteFacts)
  .filter((value) => typeof value === 'string' && value.endsWith(`@${SITE_HOST}`))
  .map((email) => `mailto:${email}`);

/** Every email link points at one of the site's addresses, and the page has at least one. */
async function expectSiteEmailLinks(page: Page) {
  const hrefs = await page
    .locator('a[href^="mailto:"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) expect(SITE_EMAILS).toContain(href);
}

/** Every App Store link is the app's listing, and the page has at least one. */
async function expectAppStoreLinks(page: Page) {
  const hrefs = await page
    .locator('a[href*="apps.apple.com"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) expect(href).toBe(APP_STORE_URL);
}

test('home page shows both phone mock-ups', async ({ page }) => {
  await page.goto('/');
  // A phone's screen stays hidden until `useFitScale` has measured its container.
  const welcomePhone = page.getByRole('img', { name: site.features.items.mood.alt });
  await expect(welcomePhone.getByText(site.features.introCue)).toBeVisible();
  await expect(page.getByText(site.demo.card0.prompt)).toBeVisible();
  await expectSiteEmailLinks(page);
  await expectAppStoreLinks(page);
});

for (const doc of ['terms', 'privacy'] as const) {
  test(`/${doc} shows its heading`, async ({ page }) => {
    await page.goto(`/${doc}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.docs[doc].title);
    await expectSiteEmailLinks(page);
  });
}

test('a Coffee Card page shows its card', async ({ page }) => {
  const card = course.cards[0];
  if (!card) throw new Error('The course has no cards; run pnpm sync-cards');
  await page.goto(`/card/${card.id}`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(card.reward.title);
  await expectAppStoreLinks(page);
});

test('an unknown address shows the 404 page', async ({ page }) => {
  const response = await page.goto('/no-such-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.notfound.title);
  await expectAppStoreLinks(page);
});
