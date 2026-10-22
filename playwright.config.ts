import { defineConfig, devices } from '@playwright/test';

/** A port of its own, so a `pnpm preview` left running on 8787 is not tested by mistake. */
const PORT = 8799;

/**
 * Smoke tests: open the site in Chromium and check its main pages work. They
 * run against the local Cloudflare preview, which each run builds afresh.
 * The pre-push hook runs them; CI does not.
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
    reuseExistingServer: false,
    // The preview builds the whole site first.
    timeout: 5 * 60_000,
  },
});
