import { defineConfig, devices } from '@playwright/test';

/** The smoke tests' own port, so a `pnpm preview` left running on port 8787 never answers them. */
const PORT = 8799;
/** Five minutes: the preview builds the whole site before it answers. */
const PREVIEW_START_TIMEOUT_MS = 300_000;

/**
 * Smoke tests: open the site's main pages in Chromium and check they work.
 * They run against `pnpm preview`, which builds the site the way Cloudflare runs it.
 * Every test run builds the site again.
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
    timeout: PREVIEW_START_TIMEOUT_MS,
  },
});
