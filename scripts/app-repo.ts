/**
 * Reads the BrewPath app's files as merged to its `main` branch on GitHub,
 * whatever branch or edits the app's clone has checked out.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const APP_BRANCH = 'main';
const APP_CLONE_FOLDER = 'brewpath';
/** Node stops reading git's output at 1 MiB by default, and the app's content files grow with each lesson. */
const MAX_GIT_OUTPUT_BYTES = 64 * 1024 * 1024;

/** Runs git in `cwd`; a failure throws git's own message, without Node's command dump. */
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
 * The app's clone: the `brewpath` folder beside this repo's first checkout.
 * Git lists the first checkout first from every worktree, so each finds the same clone.
 */
export function defaultAppRepo(cwd: string) {
  const worktrees = git(cwd, ['worktree', 'list', '--porcelain']);
  const firstCheckout = /^worktree (?<path>.+)$/m.exec(worktrees)?.groups?.path;
  if (!firstCheckout) throw new Error(`git listed no checkout for ${cwd}`);
  return join(dirname(firstCheckout), APP_CLONE_FOLDER);
}

/** Fetches the app's `main` branch from GitHub and reads its files at that commit. */
export function fetchAppMain(appRepo: string) {
  if (!existsSync(join(appRepo, '.git'))) {
    throw new Error(
      `No app clone at ${appRepo}. Clone maximsan/brewpath there, or pass the clone's path: pnpm sync-cards <path>`,
    );
  }
  // The refspec names the target, so a clone set to fetch other branches still updates origin/main.
  git(appRepo, [
    'fetch',
    '--quiet',
    'origin',
    `+refs/heads/${APP_BRANCH}:refs/remotes/origin/${APP_BRANCH}`,
  ]);
  const commit = git(appRepo, ['rev-parse', `origin/${APP_BRANCH}`]).trim();

  return {
    /** The id of the commit the files are read at. */
    commit,
    readFile: (path: string) => git(appRepo, ['cat-file', 'blob', `${commit}:${path}`]),
  };
}
