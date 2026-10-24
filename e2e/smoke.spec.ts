import { type APIRequestContext, expect, type Page, test } from '@playwright/test';

import course from '@content/en/course.json' with { type: 'json' };
import site from '@messages/en/site.json' with { type: 'json' };
import { LEGAL_DOCS } from '@domains/site/legal-docs';
import { LEGAL_PAGES, PAGE_ROUTES } from '@domains/site/routes';
import {
  APP_LINKS_HOST,
  APP_STORE_ID,
  APP_STORE_URL,
  MAILTO_HI,
  mailtoHref,
  SITE_HOST,
  SITE_URL,
} from '@domains/site/site';

const APP_STORE_HOST = new URL(APP_STORE_URL).host;

const firstCard = course.cards[0];

if (!firstCard) {
  throw new Error('The course has no cards; run pnpm sync-cards');
}
const CARD_PATH = `/card/${firstCard.id}`;
const UNKNOWN_PATH = '/no-such-path';
const APPLE_LINK_FILE_PATH = '/.well-known/apple-app-site-association';

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
  for (const href of emailLinks) {
    expect(href).toBe(MAILTO_HI);
  }

  const appStoreLinks = await linkTargets(page, `a[href*="${APP_STORE_HOST}"]`);

  expect(appStoreLinks.length, 'App Store links').toBeGreaterThan(0);
  for (const href of appStoreLinks) {
    expect(href).toBe(APP_STORE_URL);
  }
}

test('home page shows the lesson demo phone', async ({ page }) => {
  await openPath(page, PAGE_ROUTES.home);
  // `useFitScale` shrinks the phone mock-up to fit its box. The phone's
  // screen stays hidden until the hook has measured that box.
  await expect(page.getByText(site.demo.card0.prompt)).toBeVisible();
  await expectSiteLinks(page);
});

test('the home page fits a 320px-wide phone without scrolling sideways', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await openPath(page, PAGE_ROUTES.home);
  await expect(page.getByRole('button', { name: site.nav.menu })).toBeInViewport({ ratio: 1 });
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);

  expect(pageWidth).toBe(320);
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

/** Requests `path` as the given domain would receive it, without following a redirect. */
const requestOnHost = (request: APIRequestContext, host: string, path: string) =>
  request.get(path, { headers: { host }, maxRedirects: 0 });

test('the Apple link file lets the app open only card links, on both domains', async ({
  request,
}) => {
  for (const host of [SITE_HOST, APP_LINKS_HOST]) {
    const response = await requestOnHost(request, host, APPLE_LINK_FILE_PATH);

    expect(response.status(), host).toBe(200);
    const { applinks } = (await response.json()) as {
      applinks: { details: { components: { '/': string }[] }[] };
    };
    const claimedPaths = applinks.details.flatMap((detail) =>
      detail.components.map((component) => component['/']),
    );

    expect(claimedPaths, host).toEqual(['/card/*']);
  }
});

test(`${APP_LINKS_HOST} redirects to the site, or a card link to the App Store`, async ({
  request,
}) => {
  const cardDestination = APP_STORE_ID === null ? `${SITE_URL}${CARD_PATH}` : APP_STORE_URL;
  const destinations = {
    '/': `${SITE_URL}/`,
    [PAGE_ROUTES.terms]: `${SITE_URL}${PAGE_ROUTES.terms}`,
    [CARD_PATH]: cardDestination,
  };

  for (const [path, destination] of Object.entries(destinations)) {
    const response = await requestOnHost(request, APP_LINKS_HOST, path);

    expect(response.status(), path).toBe(307);
    expect(response.headers().location, path).toBe(destination);
  }
});
