import { defineConfig, devices } from '@playwright/test';

/** The smoke tests serve the site on this port. A `pnpm preview` left running on 8787 stays out of the tests. */
const PORT = 8799;

/**
 * Smoke tests: open the site's main pages in Chromium and check they work.
 * They run against the local Cloudflare preview. Every run builds it again.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm preview --port ${PORT}`,
    url: `http://localhost:${PORT}/robots.txt`,
    // The preview builds the whole site first.
    timeout: 5 * 60_000,
  },
});
