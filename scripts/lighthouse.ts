/**
 * Measures page speed with Lighthouse, Google's page-speed tool, against the
 * local Cloudflare build that `pnpm preview` serves. One run's score can vary
 * by ten points or more on the same build. So this script runs each page
 * several times and prints the middle score, the lowest and the highest.
 *
 *   pnpm preview                          # in another terminal
 *   pnpm lighthouse [--check] [path...]   # without paths: the pages in MINIMUM_SCORES
 *
 * A page whose middle score is below its minimum is listed at the end.
 * `--check` then also exits with an error.
 */
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { parseArgs } from 'node:util';

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
/**
 * The lowest middle score each page had over six of GitHub's machines on one
 * build, minus 4. Noise alone moved a middle score by up to 7 points between
 * those machines, and the lowest of six is already near the bottom of that spread.
 */
const MINIMUM_SCORES: Record<string, number> = {
  [PAGE_ROUTES.home]: 72,
  [PAGE_ROUTES.privacy]: 82,
  [cardPath(firstCard.id)]: 82,
};

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
      // Chromium starts without its sandbox, Chrome's process isolation, which GitHub's Ubuntu
      // machines block. Playwright starts it the same way for the smoke tests.
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

function median(values: number[]) {
  const middle = values.toSorted((first, second) => first - second)[Math.floor(values.length / 2)];

  if (middle === undefined) {
    throw new Error('A median needs at least one value');
  }

  return middle;
}

const { values: flags, positionals: givenPaths } = parseArgs({
  options: { check: { type: 'boolean', default: false } },
  allowPositionals: true,
});
const paths = givenPaths.length > 0 ? givenPaths : Object.keys(MINIMUM_SCORES);
const pathsWithoutMinimum = paths.filter((path) => MINIMUM_SCORES[path] === undefined);

if (flags.check && pathsWithoutMinimum.length > 0) {
  console.error(`--check needs a minimum score for: ${pathsWithoutMinimum.join(', ')}`);
  process.exit(1);
}

if (!(await previewPortIsTaken())) {
  console.error(`Nothing answers on ${PREVIEW_URL}. Start pnpm preview first.`);
  process.exit(1);
}

const pagesBelowMinimum: string[] = [];

for (const path of paths) {
  const url = new URL(path, PREVIEW_URL).href;
  const runs = Array.from({ length: RUNS_PER_PAGE }, () => measure(url));
  const scores = runs.map((run) => run.score);
  const middleScore = median(scores);
  const largestPaint = median(runs.map((run) => run.largestContentfulPaintMs));

  console.log(
    `${path}  score ${middleScore} (${Math.min(...scores)}–${Math.max(...scores)})  ` +
      `LCP ${largestPaint} ms  runs: ${scores.join(', ')}`,
  );

  const minimum = MINIMUM_SCORES[path];

  if (minimum !== undefined && middleScore < minimum) {
    pagesBelowMinimum.push(`${path} scored ${middleScore}, below its minimum of ${minimum}`);
  }
}

if (pagesBelowMinimum.length > 0) {
  console.log(`\n${pagesBelowMinimum.join('\n')}`);

  if (flags.check) {
    process.exit(1);
  }
}
