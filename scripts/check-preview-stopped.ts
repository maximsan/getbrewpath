/**
 * Stops the smoke tests while this checkout's `pnpm preview` is serving on its
 * default port. The smoke tests rebuild `.open-next`, the folder a running
 * preview serves from, and that rebuild crashes the preview. A preview served
 * from another checkout, such as another worktree, keeps running.
 *
 * `pnpm test:smoke` runs it first, so the pre-push hook stops the push too.
 */
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import process from 'node:process';

/** Wrangler's default port for `pnpm preview`; the repo sets no other. */
const PREVIEW_PORT = 8787;

/** True when something answers on the preview port, or holds the connection open without answering. */
async function previewPortIsTaken() {
  try {
    await fetch(`http://localhost:${PREVIEW_PORT}/robots.txt`, {
      signal: AbortSignal.timeout(2000),
    });
    return true;
  } catch (error) {
    return error instanceof DOMException && error.name === 'TimeoutError';
  }
}

/**
 * The folder the process listening on the preview port runs from, or
 * `undefined` when `lsof` cannot tell. A preview's server runs from the
 * checkout that started it.
 */
function servingFolder() {
  try {
    const pid = execFileSync('lsof', ['-nP', `-iTCP:${PREVIEW_PORT}`, '-sTCP:LISTEN', '-t'], {
      encoding: 'utf8',
    }).split('\n')[0];
    if (!pid) return undefined;
    const fields = execFileSync('lsof', ['-a', '-p', pid, '-d', 'cwd', '-Fn'], {
      encoding: 'utf8',
    }).split('\n');
    const nameField = fields.find((field) => field.startsWith('n'));
    return nameField && realpathSync(nameField.slice(1));
  } catch {
    return undefined;
  }
}

if (await previewPortIsTaken()) {
  const folder = servingFolder();
  if (folder === undefined || folder === realpathSync(process.cwd())) {
    console.error(
      `Something is serving on port ${PREVIEW_PORT} from ${folder ?? 'an unknown folder'}, probably pnpm preview. Stop it, then run the smoke tests again.`,
    );
    process.exit(1);
  }
  console.log(
    `A preview from ${folder} is serving on port ${PREVIEW_PORT}. It serves that folder's build, so it keeps running.`,
  );
}
