/**
 * Copies the course summary from the BrewPath app repo into this site.
 *
 *   pnpm sync-cards [path-to-brewpath-repo]   (default: ../brewpath)
 *
 * Rerun it whenever the app's lessons, modules or collectibles change.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { buildCourse } from '../src/domains/course/build-course';

const DEFAULT_APP_REPO = '../brewpath';
const BANKS_DIR = 'assets/content/generated';
const OUTPUT = 'src/content/course.json';

const appRepo = resolve(process.argv[2] ?? DEFAULT_APP_REPO);
const readBank = (name: string): unknown =>
  JSON.parse(readFileSync(join(appRepo, BANKS_DIR, `${name}.json`), 'utf8'));

const course = buildCourse({
  lessons: readBank('lessons'),
  modules: readBank('modules'),
  collectibles: readBank('collectibles'),
});

writeFileSync(OUTPUT, `${JSON.stringify(course, null, 2)}\n`);
console.log(`Wrote ${course.modules.length} modules and ${course.cards.length} cards to ${OUTPUT}`);
