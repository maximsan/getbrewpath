/**
 * Stops the smoke tests while something is serving on `pnpm preview`'s
 * default port. The smoke tests rebuild `.open-next`, the folder a running
 * preview serves from, and that rebuild crashes the preview.
 *
 * `pnpm test:smoke` runs it first, so the pre-push hook stops the push too.
 */
import process from 'node:process';

/** Wrangler's default port for `pnpm preview`; the repo sets no other. */
const PREVIEW_PORT = 8787;
/** How long a running preview gets to answer before the port counts as held open. */
const ANSWER_TIMEOUT_MS = 2000;

/** True when something answers on the preview port, or holds the connection open without answering. */
async function previewPortIsTaken() {
  try {
    await fetch(`http://localhost:${PREVIEW_PORT}/robots.txt`, {
      signal: AbortSignal.timeout(ANSWER_TIMEOUT_MS),
    });

    return true;
  } catch (error) {
    return error instanceof DOMException && error.name === 'TimeoutError';
  }
}

if (await previewPortIsTaken()) {
  console.error(
    `Something is serving on port ${PREVIEW_PORT}, probably pnpm preview. Stop it, then run the smoke tests again.`,
  );
  process.exit(1);
}
