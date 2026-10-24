/**
 * Finds out whether a `pnpm preview` serves this folder's build. The smoke
 * tests rebuild `.open-next`. A running preview serves the site from that
 * folder, and the rebuild crashes the preview. Each git worktree is its own
 * folder with its own `.open-next`, so a preview from another worktree is safe.
 */
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';

/** Wrangler's default port for `pnpm preview`; the repo sets no other. */
export const PREVIEW_PORT = 8787;

/** `lsof -F` starts each output line with a one-letter field code; `n` marks a file name. */
const LSOF_NAME_FIELD = 'n';

/** True when something answers on the preview port, or holds the connection open without answering. */
export async function previewPortIsTaken() {
  try {
    await fetch(`http://localhost:${PREVIEW_PORT}/robots.txt`, {
      signal: AbortSignal.timeout(2000),
    });
    return true;
  } catch (error) {
    return error instanceof DOMException && error.name === 'TimeoutError';
  }
}

/** The folders in the output of `lsof -d cwd -Fn`: the working folder of each listed process. */
export function processFolders(lsofOutput: string) {
  return lsofOutput
    .split('\n')
    .filter((line) => line.startsWith(LSOF_NAME_FIELD))
    .map((line) => line.slice(LSOF_NAME_FIELD.length));
}

/**
 * The working folders of the processes listening on the preview port. A
 * preview's server keeps the working folder of the command that started it.
 * Empty when `lsof` is missing or lists no listener.
 */
export function previewFolders() {
  try {
    const listeningProcesses = lsof(['-nP', `-iTCP:${PREVIEW_PORT}`, '-sTCP:LISTEN', '-t'])
      .trim()
      .split('\n')
      .join(',');
    const output = lsof(['-a', '-d', 'cwd', '-Fn', '-p', listeningProcesses]);
    return processFolders(output).map((folder) => realpathSync(folder));
  } catch {
    return [];
  }
}

/** True when a preview may serve `thisFolder`'s build: one has it as its working folder, or no folder was found. */
export function smokeTestsMustStop(previewFolders: string[], thisFolder: string) {
  return previewFolders.length === 0 || previewFolders.includes(thisFolder);
}

function lsof(args: string[]) {
  return execFileSync('lsof', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}
