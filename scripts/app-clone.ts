/**
 * Finds the BrewPath app's clone on this computer, and reads the app's files
 * through it as merged to `main` on GitHub: whatever branch the clone is on,
 * and whatever uncommitted edits it has.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const APP_BRANCH = 'main';
const APP_CLONE_FOLDER = 'brewpath';
/** Node stops reading git's output at 1 MiB by default, and the app's content files grow with each lesson. */
const MAX_GIT_OUTPUT_BYTES = 64 * 1024 * 1024;

/** Runs git in `cwd`; a failure throws git's own message, without the full command Node adds to the error. */
function git(cwd: string, args: string[]) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      maxBuffer: MAX_GIT_OUTPUT_BYTES,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const [command] = args;
    const gitMessage = (error as { stderr?: string }).stderr?.trim();
    throw new Error(`git ${command} failed in ${cwd}: ${gitMessage || String(error)}`);
  }
}

/**
 * Where the app's clone should be: the `brewpath` folder beside this repo's folder.
 * `git worktree list` shows this repo's folder first in every worktree, so every
 * worktree gets the same path.
 */
export function appClonePath(cwd: string) {
  const worktrees = git(cwd, ['worktree', 'list', '--porcelain']);
  const repoFolder = /^worktree (?<path>.+)$/m.exec(worktrees)?.groups?.path;
  if (!repoFolder) throw new Error(`git listed no folder for this repo in ${cwd}`);
  return join(dirname(repoFolder), APP_CLONE_FOLDER);
}

/** Fetches the app's `main` branch from GitHub into its clone, and reads the app's files at that commit. */
export function fetchAppMainFiles(appClone: string) {
  if (!existsSync(join(appClone, '.git'))) {
    throw new Error(
      `No app clone at ${appClone}. Clone maximsan/brewpath there, or pass the clone's path: pnpm sync-cards <path>`,
    );
  }
  // The fetch names origin/main as its destination, so it updates even in a clone set to fetch other branches.
  git(appClone, [
    'fetch',
    '--quiet',
    'origin',
    `+refs/heads/${APP_BRANCH}:refs/remotes/origin/${APP_BRANCH}`,
  ]);
  const commit = git(appClone, ['rev-parse', `origin/${APP_BRANCH}`]).trim();

  return {
    /** The id of the commit the files are read at. */
    commit,
    readFile: (path: string) => git(appClone, ['cat-file', 'blob', `${commit}:${path}`]),
  };
}
