/**
 * Copies the course summary from the BrewPath app's `main` branch on GitHub
 * into this site, once per language the site is published in. It reads the
 * app's content files through the app's clone: by default the folder that
 * `appClonePath` in `app-clone.ts` names, or the path given after the command.
 *
 *   pnpm sync-cards [path-to-app-clone]
 *
 * Rerun it whenever the app's lessons, modules, collectibles or free lessons
 * change, or a language is added to `src/i18n/routing.ts`.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { z } from 'zod';
import opentype from 'opentype.js';

import { buildCourse, type ContentBanks } from '../src/domains/course/build-course';
import { courseCounts } from '../src/domains/course/course';
import { overlayTranslation } from '../src/domains/course/overlay-translation';
import { type Locale, routing } from '../src/i18n/routing';
import { APP_BRANCH, appClonePath, fetchAppMainFiles } from './app-clone';
import { artPalette, renderCardArt } from './card-art';
import { outlineCardArt } from './outline-card-art';

/**
 * The app's English content. Each other language has a folder of translated
 * fields; a translated field replaces the English one.
 */
const MASTER_DIR = 'assets/content/generated';
const translationDir = (locale: Locale) => `assets/content/l10n/${locale}`;
const outputFile = (locale: Locale) => `src/content/${locale}/course.json`;

/** The content files the app has once per language. The free lessons file is one for all. */
type Bank = Exclude<keyof ContentBanks, 'freeTier'> | 'card_art_words';
type Records = Record<string, unknown>[];

/** Fetches the app's `main` branch through its clone. On failure, prints the reason and exits. */
function fetchAppMainFilesOrExit() {
  try {
    const appClone = process.argv[2] ? resolve(process.argv[2]) : appClonePath(process.cwd());
    const appMainFiles = fetchAppMainFiles(appClone);

    console.log(`Reading ${appClone} at ${APP_BRANCH}, commit ${appMainFiles.commit}`);

    return appMainFiles;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

const appMainFiles = fetchAppMainFilesOrExit();

/** A bank file's records; `buildCourse` checks their shape. */
const readRecords = (dir: string, bank: Bank) =>
  (JSON.parse(appMainFiles.readFile(`${dir}/${bank}.json`)) as { items: Records }).items;

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
  card_art_words: readRecords(MASTER_DIR, 'card_art_words'),
};
/** The free lessons and the daily limit, read once for every language. */
const freeTier: unknown = JSON.parse(appMainFiles.readFile(`${MASTER_DIR}/website/free_tier.json`));
const wordBankSchema = z.array(z.object({ id: z.string(), text: z.string().min(1) }));
const css = readFileSync('src/app/globals.css', 'utf8');
const readFont = (path: string) => {
  const bytes = appMainFiles.readFileBytes(path);

  return opentype.parse(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer,
  );
};
const artFonts = {
  'IBM Plex Mono': readFont('assets/fonts/IBMPlexMono-Medium.ttf'),
  'Fraunces:italic': readFont('assets/fonts/Fraunces-Italic-Variable.ttf'),
};

for (const locale of routing.locales) {
  const records = (bank: Bank) =>
    locale === routing.defaultLocale
      ? english[bank]
      : overlayTranslation(
          english[bank],
          readRecords(translationDir(locale), bank),
          `${locale}/${bank}`,
        );
  const course = buildCourse(banksBy(records));
  const words = Object.fromEntries(
    wordBankSchema.parse(records('card_art_words')).map(({ id, text }) => [id, text]),
  );
  const drawings = Object.fromEntries(
    course.cards.map(({ kind }) => {
      const slug = kind.replace(/(?<=[a-z\d])(?=[A-Z])/g, '_').toLowerCase();
      const svg = appMainFiles.readFile(`assets/card_art/${slug}.svg`).trim();

      return [
        kind,
        {
          cupping: outlineCardArt(renderCardArt(svg, words, artPalette(css, 'cupping')), artFonts),
          'dark-roast': outlineCardArt(
            renderCardArt(svg, words, artPalette(css, 'dark-roast')),
            artFonts,
          ),
        },
      ];
    }),
  );

  mkdirSync(dirname(outputFile(locale)), { recursive: true });
  writeFileSync(outputFile(locale), `${JSON.stringify(course, null, 2)}\n`);
  writeFileSync(`src/content/${locale}/card-art.json`, `${JSON.stringify(drawings, null, 2)}\n`);
  const counts = courseCounts(course);

  console.log(
    `${locale}: wrote ${counts.modules} modules, ${counts.lessons} lessons of which ${counts.freeLessons} free, ${counts.cards} cards, ${course.freeDailyActivities} activities a day free`,
  );
}
