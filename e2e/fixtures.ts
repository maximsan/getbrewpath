import { test as base, expect } from '@playwright/test';

import { WEB_ANALYTICS_SCRIPT } from '@domains/site/site';

/**
 * Playwright's `test`, with rules every smoke test follows. Test files import
 * `test` and `expect` from here, not from `@playwright/test`.
 */
export const test = base.extend<{ countsNoVisits: void; blockedByPolicy: void }>({
  /** The tests never load the visit counter's script, so they count no visits. */
  countsNoVisits: [
    async ({ page }, use) => {
      await page.route(WEB_ANALYTICS_SCRIPT, (route) => route.abort());
      await use();
    },
    { auto: true },
  ],
  /** Every test fails if the page tries to load anything the Content Security Policy blocks. */
  blockedByPolicy: [
    async ({ page }, use) => {
      const blocked: string[] = [];

      await page.exposeFunction('reportBlocked', (address: string) => blocked.push(address));
      await page.addInitScript(() =>
        document.addEventListener('securitypolicyviolation', (event) =>
          (window as unknown as { reportBlocked: (address: string) => void }).reportBlocked(
            `${event.violatedDirective}: ${event.blockedURI}`,
          ),
        ),
      );
      await use();
      expect(blocked).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
