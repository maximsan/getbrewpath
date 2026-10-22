import { expect, type Page, test } from '@playwright/test';

import course from '@content/en/course.json' with { type: 'json' };
import site from '@messages/en/site.json' with { type: 'json' };
import { LEGAL_DOCS } from '@domains/site/legal-docs';
import { LEGAL_PAGES, PAGE_ROUTES } from '@domains/site/routes';
import { APP_STORE_URL, EMAIL_HI, EMAIL_SUPPORT, mailtoHref } from '@domains/site/site';

const SITE_EMAIL_LINKS = [EMAIL_HI, EMAIL_SUPPORT].map(mailtoHref);
const APP_STORE_HOST = new URL(APP_STORE_URL).host;

const firstCard = course.cards[0];
if (!firstCard) throw new Error('The course has no cards; run pnpm sync-cards');
const CARD_PATH = `/card/${firstCard.id}`;
const UNKNOWN_PATH = '/no-such-path';

/** The `href` of each link on the page that `selector` matches. */
const linkTargets = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll((links) => links.map((link) => link.getAttribute('href')));

/** Opens `path` and checks the server answered with `status`. */
async function openPath(page: Page, path: string, status = 200) {
  const response = await page.goto(path);
  expect(response?.status()).toBe(status);
}

/** Checks that the page's email links and App Store links point at the site's addresses. */
async function expectSiteLinks(page: Page) {
  const emailLinks = await linkTargets(page, 'a[href^="mailto:"]');
  expect(emailLinks.length, 'email links').toBeGreaterThan(0);
  for (const href of emailLinks) expect(SITE_EMAIL_LINKS).toContain(href);

  const appStoreLinks = await linkTargets(page, `a[href*="${APP_STORE_HOST}"]`);
  expect(appStoreLinks.length, 'App Store links').toBeGreaterThan(0);
  for (const href of appStoreLinks) expect(href).toBe(APP_STORE_URL);
}

test('home page shows both phone mock-ups', async ({ page }) => {
  await openPath(page, PAGE_ROUTES.home);
  // `useFitScale` shrinks each phone mock-up to fit its box. The phone's
  // screen stays hidden until the hook has measured that box.
  const introPhone = page.getByRole('img', { name: site.features.items.mood.alt });
  await expect(introPhone.getByText(site.features.introCue)).toBeVisible();
  await expect(page.getByText(site.demo.card0.prompt)).toBeVisible();
  await expectSiteLinks(page);
});

for (const doc of LEGAL_PAGES) {
  test(`${doc} page shows its heading and contact address`, async ({ page }) => {
    await openPath(page, PAGE_ROUTES[doc]);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.docs[doc].title);
    expect(await linkTargets(page, 'a[href^="mailto:"]')).toContain(
      mailtoHref(LEGAL_DOCS[doc].email),
    );
    await expectSiteLinks(page);
  });
}

test('a Coffee Card page shows its card', async ({ page }) => {
  await openPath(page, CARD_PATH);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(firstCard.reward.title);
  await expectSiteLinks(page);
});

test('an unknown URL shows the not-found page', async ({ page }) => {
  await openPath(page, UNKNOWN_PATH, 404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.notfound.title);
  await expectSiteLinks(page);
});
