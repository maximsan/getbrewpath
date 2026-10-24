/**
 * Copies the course summary from the BrewPath app's `main` branch on GitHub
 * into this site, once per language the site is published in. It reads them
 * through a clone of the app repo: by default the `brewpath` folder next to the
 * folder this repo was cloned into, or the path given after the command.
 *
 *   pnpm sync-cards [path-to-app-clone]
 *
 * Rerun it whenever the app's lessons, modules, collectibles or free lessons
 * change, or a language is added to `src/i18n/routing.ts`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

import { buildCourse, type ContentBanks } from '../src/domains/course/build-course';
import { courseCounts } from '../src/domains/course/course';
import { overlayTranslation } from '../src/domains/course/overlay-translation';
import { type Locale, routing } from '../src/i18n/routing';
import { APP_BRANCH, fetchAppMainBranch, findAppClone } from './app-main-branch';

/**
 * The app's English content. Each other language has a folder of translated
 * fields; a translated field replaces the English one.
 */
const MASTER_DIR = 'assets/content/generated';
const translationDir = (locale: Locale) => `assets/content/l10n/${locale}`;
const outputFile = (locale: Locale) => `src/content/${locale}/course.json`;
/** The content files the app has once per language. The free lessons file is one for all. */
type Bank = Exclude<keyof ContentBanks, 'freeTier'>;
type Records = Record<string, unknown>[];

/** Fetches the app's `main` branch through its clone. On failure, prints the reason and exits. */
function fetchAppMainBranchOrExit() {
  try {
    const appClone = process.argv[2] ? resolve(process.argv[2]) : findAppClone(process.cwd());
    const appMainBranch = fetchAppMainBranch(appClone);
    console.log(`Reading ${appClone} at ${APP_BRANCH}, commit ${appMainBranch.commit}`);
    return appMainBranch;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

const appMainBranch = fetchAppMainBranchOrExit();

/** A bank file's records; `buildCourse` checks their shape. */
const readRecords = (dir: string, bank: Bank) =>
  (JSON.parse(appMainBranch.readFile(`${dir}/${bank}.json`)) as { items: Records }).items;

const banksBy = (records: (bank: Bank) => Records): ContentBanks => ({
  lessons: { items: records('lessons') },
  modules: { items: records('modules') },
  collectibles: { items: records('collectibles') },
  freeTier,
});

const english: Record<Bank, Records> = {
  lessons: readRecords(MASTER_DIR, 'lessons'),
  modules: readRecords(MASTER_DIR, 'modules'),
  collectibles: readRecords(MASTER_DIR, 'collectibles'),
};
/** The free lessons and the daily limit, read once for every language. */
const freeTier: unknown = JSON.parse(
  appMainBranch.readFile(`${MASTER_DIR}/website/free_tier.json`),
);

for (const locale of routing.locales) {
  const banks = banksBy((bank) =>
    locale === routing.defaultLocale
      ? english[bank]
      : overlayTranslation(
          english[bank],
          readRecords(translationDir(locale), bank),
          `${locale}/${bank}`,
        ),
  );
  const course = buildCourse(banks);
  mkdirSync(dirname(outputFile(locale)), { recursive: true });
  writeFileSync(outputFile(locale), `${JSON.stringify(course, null, 2)}\n`);
  const counts = courseCounts(course);
  console.log(
    `${locale}: wrote ${counts.modules} modules, ${counts.lessons} lessons of which ${counts.freeLessons} free, ${counts.cards} cards, ${course.freeDailyActivities} activities a day free`,
  );
}
