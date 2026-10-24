import course from '@content/en/course.json' with { type: 'json' };
import site from '@messages/en/site.json' with { type: 'json' };
import { BRAND_COLORS } from '@domains/site/brand';
import { legalPageSource } from '@domains/site/legal-pages';
import { LEGAL_PAGES, PAGE_ROUTES } from '@domains/site/routes';
import {
  APP_LINKS_HOST,
  APP_STORE_ID,
  APP_STORE_URL,
  mailtoHref,
  SITE_HOST,
  SITE_URL,
} from '@domains/site/site';

import { expect, test } from './fixtures';
import {
  expectSiteLinks,
  expectVisitCounter,
  hexToRgb,
  linkTargets,
  openPath,
  requestOnHost,
} from './helpers';

const firstCard = course.cards[0];
if (!firstCard) throw new Error('The course has no cards; run pnpm sync-cards');
const CARD_PATH = `/card/${firstCard.id}`;
const UNKNOWN_PATH = '/no-such-path';
const APPLE_LINK_FILE_PATH = '/.well-known/apple-app-site-association';

test('home page shows the lesson demo phone', async ({ page }) => {
  await openPath(page, PAGE_ROUTES.home);
  // `useFitScale` shrinks the phone mock-up to fit its box. The phone's
  // screen stays hidden until the hook has measured that box.
  await expect(page.getByText(site.demo.card0.prompt)).toBeVisible();
  await expectSiteLinks(page);
  await expectVisitCounter(page);
});

test('the home page fits a 320px-wide phone without scrolling sideways', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await openPath(page, PAGE_ROUTES.home);
  await expect(page.getByRole('button', { name: site.nav.menu })).toBeInViewport({ ratio: 1 });
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBe(320);
});

test('a phone in dark mode shows Dark Roast from the first paint', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  // Without the scripts the page is never hydrated, so it stays as first painted.
  await page.route('**/_next/static/chunks/*.js', (route) => route.abort());
  await openPath(page, PAGE_ROUTES.home);
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    hexToRgb(BRAND_COLORS.darkRoast),
  );
});

test("while the phone menu is open, the page under it can't be reached by keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPath(page, PAGE_ROUTES.home);
  await page.getByRole('button', { name: site.nav.menu }).click();
  await expect(page.locator('main')).toHaveJSProperty('inert', true);
  await page.keyboard.press('Escape');
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
});

for (const doc of LEGAL_PAGES) {
  test(`${doc} page shows its heading and contact address`, async ({ page }) => {
    await openPath(page, PAGE_ROUTES[doc]);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.docs[doc].title);
    expect(await linkTargets(page, 'a[href^="mailto:"]')).toContain(
      mailtoHref(legalPageSource(doc).email),
    );
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: site.footer[doc] }),
    ).toHaveAttribute('href', PAGE_ROUTES[doc]);
    await expectSiteLinks(page);
    await expectVisitCounter(page);
  });
}

test('a Coffee Card page shows its card', async ({ page }) => {
  await openPath(page, CARD_PATH);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(firstCard.reward.title);
  await expectSiteLinks(page);
  await expectVisitCounter(page);
});

test('an unknown URL shows the not-found page', async ({ page }) => {
  await openPath(page, UNKNOWN_PATH, 404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.notfound.title);
  await expectSiteLinks(page);
});

test('the Apple link file lets the app open only card links, on both domains', async ({
  request,
}) => {
  for (const host of [SITE_HOST, APP_LINKS_HOST]) {
    const response = await requestOnHost(request, host, APPLE_LINK_FILE_PATH);
    expect(response.status(), host).toBe(200);
    const { applinks } = (await response.json()) as {
      applinks: { details: { components: { '/': string }[] }[] };
    };
    const claimedPaths = applinks.details.flatMap((detail) => detail.components.map((c) => c['/']));
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
