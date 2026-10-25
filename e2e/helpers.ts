import type { APIRequestContext, Page } from '@playwright/test';

import {
  APP_STORE_URL,
  MAILTO_HI,
  WEB_ANALYTICS_SCRIPT,
  WEB_ANALYTICS_TOKEN,
} from '@domains/site/site';

import { expect } from './fixtures';

const APP_STORE_HOST = new URL(APP_STORE_URL).host;

/** The `href` of each link on the page that `selector` matches. */
export const linkTargets = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll((links) => links.map((link) => link.getAttribute('href')));

/** `#1A130E` as CSS reports a colour: `rgb(26, 19, 14)`. */
export function hexToRgb(hex: string) {
  const channels = /^#(?<red>\w{2})(?<green>\w{2})(?<blue>\w{2})$/.exec(hex)?.groups;

  if (!channels) {
    throw new Error(`Not a #RRGGBB colour: ${hex}`);
  }
  const { red, green, blue } = channels;

  return `rgb(${[red, green, blue].map((channel) => parseInt(channel ?? '', 16)).join(', ')})`;
}

/** Opens `path` and checks the server answered with `status`. */
export async function openPath(page: Page, path: string, status = 200) {
  const response = await page.goto(path);

  expect(response?.status()).toBe(status);
}

/** Requests `path`, without following a redirect. */
export const requestWithoutRedirect = (
  request: APIRequestContext,
  path: string,
  headers: Record<string, string> = {},
) => request.get(path, { headers, maxRedirects: 0 });

/** Requests `path` as the given domain would receive it, without following a redirect. */
export const requestOnHost = (request: APIRequestContext, host: string, path: string) =>
  requestWithoutRedirect(request, path, { host });

/** Checks that the page loads the visit counter with the site's key. */
export async function expectVisitCounter(page: Page) {
  const counter = page.locator(`script[src="${WEB_ANALYTICS_SCRIPT}"]`);

  await expect(counter).toHaveCount(1);
  expect(JSON.parse((await counter.getAttribute('data-cf-beacon')) ?? '{}')).toEqual({
    token: WEB_ANALYTICS_TOKEN,
  });
}

/** Checks that the page's email links and App Store links point at the site's addresses. */
export async function expectSiteLinks(page: Page) {
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
