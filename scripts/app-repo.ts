/**
 * Reads the BrewPath app repo's files from its `main` branch on GitHub, so the
 * site copies released content whatever the app's folder has checked out.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const APP_BRANCH = 'main';
const APP_REPO_FOLDER = 'brewpath';
/** The app's content files pass through git's output; its largest is a few hundred kilobytes. */
const MAX_FILE_BYTES = 64 * 1024 * 1024;

const git = (cwd: string, args: string[]) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: MAX_FILE_BYTES,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

/**
 * The app repo's folder: next to this site's main folder. Found through git's
 * folder that all worktrees share, so it is the same from any worktree.
 */
export function defaultAppRepo(cwd: string) {
  const sharedGitDir = git(cwd, ['rev-parse', '--path-format=absolute', '--git-common-dir']);
  return join(dirname(dirname(sharedGitDir.trim())), APP_REPO_FOLDER);
}

/** Fetches the app's `main` branch from GitHub and reads its files at that commit. */
export function fetchAppMain(appRepo: string) {
  if (!existsSync(join(appRepo, '.git'))) {
    throw new Error(
      `No app repo at ${appRepo}. Clone maximsan/brewpath there, or pass its path: pnpm sync-cards <path>`,
    );
  }
  git(appRepo, ['fetch', '--quiet', 'origin', APP_BRANCH]);
  const commit = git(appRepo, ['rev-parse', `origin/${APP_BRANCH}`]).trim();

  return {
    /** The id of the commit the files are read at. */
    commit,
    readFile: (path: string) => git(appRepo, ['show', `${commit}:${path}`]),
  };
}
