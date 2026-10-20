/**
 * Copies the course summary from the BrewPath app repo into this site, once
 * per language the site is published in.
 *
 *   pnpm sync-cards [path-to-brewpath-repo]   (default: ../brewpath)
 *
 * Rerun it whenever the app's lessons, modules or collectibles change, or a
 * language is added to `src/i18n/routing.ts`.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { buildCourse } from '../src/domains/course/build-course';
import { overlayTranslation } from '../src/domains/course/overlay-translation';
import { type Locale, routing } from '../src/i18n/routing';

const DEFAULT_APP_REPO = '../brewpath';
/** The app's English content; every other language is a folder laid over it. */
const MASTER_DIR = 'assets/content/generated';
const translationDir = (locale: Locale) => `assets/content/l10n/${locale}`;
const outputFile = (locale: Locale) => `src/content/${locale}/course.json`;
const BANKS = ['lessons', 'modules', 'collectibles'] as const;

const appRepo = resolve(process.argv[2] ?? DEFAULT_APP_REPO);

const readItems = (dir: string, bank: string): Record<string, unknown>[] => {
  const file = JSON.parse(readFileSync(join(appRepo, dir, `${bank}.json`), 'utf8')) as {
    items: Record<string, unknown>[];
  };
  return file.items;
};

const bankIn = (locale: Locale, bank: string) => {
  const master = readItems(MASTER_DIR, bank);
  return locale === routing.defaultLocale
    ? master
    : overlayTranslation(master, readItems(translationDir(locale), bank), `${locale}/${bank}`);
};

for (const locale of routing.locales) {
  const [lessons, modules, collectibles] = BANKS.map((bank) => ({ items: bankIn(locale, bank) }));
  const course = buildCourse({ lessons, modules, collectibles });
  mkdirSync(`src/content/${locale}`, { recursive: true });
  writeFileSync(outputFile(locale), `${JSON.stringify(course, null, 2)}\n`);
  console.log(`${locale}: wrote ${course.modules.length} modules and ${course.cards.length} cards`);
}
