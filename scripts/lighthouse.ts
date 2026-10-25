/**
 * Measures page speed with Lighthouse, Google's page-speed tool, against the
 * local Cloudflare build that `pnpm preview` serves. One run's score can vary
 * by ten points or more on the same build. So this script runs each page
 * several times and prints the middle score, the lowest and the highest.
 *
 *   pnpm preview                  # in another terminal
 *   pnpm lighthouse [path...]     # without paths: the pages in DEFAULT_PATHS
 */
import { execFileSync } from 'node:child_process';
import process from 'node:process';

import { chromium } from '@playwright/test';

import course from '../src/content/en/course.json' with { type: 'json' };
import { cardPath, PAGE_ROUTES } from '../src/domains/site/routes';
import { PREVIEW_PORT, previewPortIsTaken } from './preview-port';

const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;
/** Odd, so the middle score is one of the runs. */
const RUNS_PER_PAGE = 5;
/** A Lighthouse report is several megabytes; Node's default output limit is 1 MB. */
const REPORT_MAX_BYTES = 64_000_000;

const firstCard = course.cards[0];

if (!firstCard) {
  throw new Error('The course has no cards; run pnpm sync-cards');
}
const DEFAULT_PATHS = [PAGE_ROUTES.home, PAGE_ROUTES.privacy, cardPath(firstCard.id)];

interface PageSpeed {
  score: number;
  /** Largest Contentful Paint: when the biggest text or image is drawn. */
  largestContentfulPaintMs: number;
}

interface LighthouseReport {
  /** Null when the page failed to load; `runtimeError` then says why. */
  categories: { performance: { score: number | null } };
  audits: { 'largest-contentful-paint': { numericValue: number } };
  runtimeError?: { message: string };
}

function measure(url: string): PageSpeed {
  const output = execFileSync(
    'pnpm',
    [
      'exec',
      'lighthouse',
      url,
      '--quiet',
      '--only-categories=performance',
      // Without its sandbox, as Playwright starts it: GitHub's Ubuntu machines block the sandbox.
      '--chrome-flags=--headless=new --no-sandbox',
      '--output=json',
      '--output-path=stdout',
    ],
    {
      encoding: 'utf8',
      maxBuffer: REPORT_MAX_BYTES,
      // The Chromium that `pnpm test:smoke` uses, so no separate Chrome is needed.
      env: { ...process.env, CHROME_PATH: chromium.executablePath() },
    },
  );
  const report = JSON.parse(output) as LighthouseReport;
  const { score } = report.categories.performance;

  if (score === null) {
    throw new Error(`Lighthouse could not measure ${url}: ${report.runtimeError?.message}`);
  }

  return {
    score: Math.round(score * 100),
    largestContentfulPaintMs: Math.round(report.audits['largest-contentful-paint'].numericValue),
  };
}

const median = (values: number[]) =>
  values.toSorted((first, second) => first - second)[Math.floor(values.length / 2)];

if (!(await previewPortIsTaken())) {
  console.error(`Nothing answers on ${PREVIEW_URL}. Start pnpm preview first.`);
  process.exit(1);
}

const givenPaths = process.argv.slice(2);

for (const path of givenPaths.length > 0 ? givenPaths : DEFAULT_PATHS) {
  const url = new URL(path, PREVIEW_URL).href;
  const runs = Array.from({ length: RUNS_PER_PAGE }, () => measure(url));
  const scores = runs.map((run) => run.score);
  const largestPaint = median(runs.map((run) => run.largestContentfulPaintMs));

  console.log(
    `${path}  score ${median(scores)} (${Math.min(...scores)}–${Math.max(...scores)})  ` +
      `LCP ${largestPaint} ms  runs: ${scores.join(', ')}`,
  );
}
