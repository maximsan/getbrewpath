/**
 * Copies the course summary from the BrewPath app repo into this site, once
 * per language the site is published in.
 *
 *   pnpm sync-cards [path-to-brewpath-repo]   (default: ../brewpath)
 *
 * Rerun it whenever the app's lessons, modules, collectibles or free tier
 * change, or a language is added to `src/i18n/routing.ts`.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { buildCourse, type ContentBanks } from '../src/domains/course/build-course';
import { overlayTranslation } from '../src/domains/course/overlay-translation';
import { type Locale, routing } from '../src/i18n/routing';

const DEFAULT_APP_REPO = '../brewpath';
/**
 * The app's English content. Each other language has a folder of translated
 * fields; a translated field replaces the English one.
 */
const MASTER_DIR = 'assets/content/generated';
const translationDir = (locale: Locale) => `assets/content/l10n/${locale}`;
/** The free lessons and the daily limit: one file, the same in every language. */
const FREE_TIER_FILE = 'assets/content/generated/website/free_tier.json';
const outputFile = (locale: Locale) => `src/content/${locale}/course.json`;
/** The banks with a file per language. */
type Bank = Exclude<keyof ContentBanks, 'freeTier'>;
type Records = Record<string, unknown>[];

const appRepo = resolve(process.argv[2] ?? DEFAULT_APP_REPO);

/** A bank file's records; `buildCourse` checks their shape. */
const readRecords = (dir: string, bank: Bank) =>
  (JSON.parse(readFileSync(join(appRepo, dir, `${bank}.json`), 'utf8')) as { items: Records })
    .items;

const freeTier: unknown = JSON.parse(readFileSync(join(appRepo, FREE_TIER_FILE), 'utf8'));

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
  console.log(`${locale}: wrote ${course.modules.length} modules and ${course.cards.length} cards`);
}
