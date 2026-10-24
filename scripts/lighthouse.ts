/**
 * Measures page speed with Lighthouse against the build `pnpm preview` serves,
 * several runs per page. One run's score swings by up to ten points on the
 * same build, so it prints the middle score and the lowest and highest.
 *
 *   pnpm preview                  # in another terminal
 *   pnpm lighthouse [path...]     # default: home, privacy policy, first card
 */
import { execFileSync } from 'node:child_process';
import process from 'node:process';

import course from '../src/content/en/course.json' with { type: 'json' };
import { PAGE_ROUTES } from '../src/domains/site/routes';

/** Pinned so scores stay comparable: each Lighthouse version weighs the metrics differently. */
const LIGHTHOUSE = 'lighthouse@13.5.0';
const PREVIEW_URL = 'http://localhost:8787';
const RUNS_PER_PAGE = 5;

const firstCard = course.cards[0];
if (!firstCard) throw new Error('The course has no cards; run pnpm sync-cards');
const DEFAULT_PATHS = [PAGE_ROUTES.home, PAGE_ROUTES.privacy, `/card/${firstCard.id}`];

interface Run {
  score: number;
  /** Largest Contentful Paint: when the biggest text or image is drawn, in milliseconds. */
  lcp: number;
}

interface LighthouseReport {
  categories: { performance: { score: number } };
  audits: { 'largest-contentful-paint': { numericValue: number } };
}

function measure(url: string): Run {
  const output = execFileSync(
    'pnpm',
    [
      'dlx',
      LIGHTHOUSE,
      url,
      '--quiet',
      '--only-categories=performance',
      '--chrome-flags=--headless=new',
      '--output=json',
      '--output-path=stdout',
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );
  const report = JSON.parse(output) as LighthouseReport;
  return {
    score: Math.round(report.categories.performance.score * 100),
    lcp: Math.round(report.audits['largest-contentful-paint'].numericValue),
  };
}

const middle = (values: number[]) =>
  values.toSorted((a, b) => a - b)[Math.floor(values.length / 2)];

async function previewIsRunning() {
  try {
    await fetch(`${PREVIEW_URL}/robots.txt`, { signal: AbortSignal.timeout(2000) });
    return true;
  } catch {
    return false;
  }
}

if (!(await previewIsRunning())) {
  console.error(`Nothing answers on ${PREVIEW_URL}. Start pnpm preview first.`);
  process.exit(1);
}

const paths = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_PATHS;
for (const path of paths) {
  const runs = Array.from({ length: RUNS_PER_PAGE }, () => measure(PREVIEW_URL + path));
  const scores = runs.map((run) => run.score);
  console.log(
    `${path}  score ${middle(scores)} (${Math.min(...scores)}–${Math.max(...scores)})  ` +
      `LCP ${middle(runs.map((run) => run.lcp))} ms  runs: ${scores.join(', ')}`,
  );
}
