/**
 * Stops the smoke tests while a `pnpm preview` serves this folder's build,
 * because the smoke tests' rebuild would crash it.
 *
 * `pnpm test:smoke` runs it first, so the pre-push hook stops the push too.
 */
import { realpathSync } from 'node:fs';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  PREVIEW_PORT,
  previewFolders,
  previewPortIsTaken,
  smokeTestsMustStop,
} from './preview-port';

const THIS_FOLDER = realpathSync(fileURLToPath(new URL('..', import.meta.url)));

// Asking the port first keeps the tests going where `lsof` is missing and nothing serves.
if (await previewPortIsTaken()) {
  const folders = previewFolders();
  if (smokeTestsMustStop(folders, THIS_FOLDER)) {
    console.error(
      `A server, probably pnpm preview, is serving on port ${PREVIEW_PORT} from ${folders.join(', ') || 'an unknown folder'}. The smoke tests' rebuild would crash it. Stop it, then run the smoke tests again.`,
    );
    process.exit(1);
  }
  console.log(
    `A preview from ${folders.join(', ')} is serving on port ${PREVIEW_PORT}. The smoke tests rebuild only this folder, so that preview keeps running.`,
  );
}
