import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { appClonePath, fetchAppMainFiles } from './app-clone';

const FREE_TIER_FILE = 'assets/content/generated/website/free_tier.json';
/** The app's free tier file, in its real shape, with a different daily limit per version. */
const freeTier = (freeDailyActivities: number) =>
  JSON.stringify({ freeLessonIds: ['m1l1', 'm1l2', 'm1l3'], freeDailyActivities });

let root: string;

const git = (cwd: string, ...args: string[]) =>
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], {
    cwd,
    encoding: 'utf8',
    stdio: 'pipe',
  });

/** Writes `text` to `file` in the checkout at `dir` and commits it. */
function commitFile(dir: string, file: string, text: string) {
  mkdirSync(dirname(join(dir, file)), { recursive: true });
  writeFileSync(join(dir, file), text);
  git(dir, 'add', file);
  git(dir, 'commit', '--quiet', '-m', `write ${file}`);
}

/** Creates a stand-in for the app on GitHub, and a clone of it at `<root>/brewpath`. */
function cloneApp() {
  const github = join(root, 'github.git');
  git(root, 'init', '--quiet', '--bare', '--initial-branch=main', github);
  const app = join(root, 'brewpath');
  git(root, 'clone', '--quiet', github, app);
  commitFile(app, FREE_TIER_FILE, freeTier(2));
  git(app, 'push', '--quiet', 'origin', 'HEAD:main');
  git(app, 'fetch', '--quiet');
  return app;
}

/** Pushes a new daily limit to the stand-in for GitHub from a second clone. */
function pushFromAnotherClone(freeDailyActivities: number) {
  const otherClone = join(root, 'other');
  git(root, 'clone', '--quiet', join(root, 'github.git'), otherClone);
  commitFile(otherClone, FREE_TIER_FILE, freeTier(freeDailyActivities));
  git(otherClone, 'push', '--quiet', 'origin', 'HEAD:main');
  return git(otherClone, 'rev-parse', 'HEAD').trim();
}

beforeEach(() => {
  // A git hook exports GIT_DIR and other GIT_ variables; left in place, they would point every git call at this repo.
  for (const name of Object.keys(process.env)) {
    if (name.startsWith('GIT_')) vi.stubEnv(name, undefined);
  }
  vi.stubEnv('GIT_CONFIG_GLOBAL', '/dev/null');
  vi.stubEnv('GIT_CONFIG_NOSYSTEM', '1');
  root = realpathSync(mkdtempSync(join(tmpdir(), 'app-clone-')));
});

afterEach(() => {
  vi.unstubAllEnvs();
  rmSync(root, { recursive: true, force: true });
});

describe('appClonePath', () => {
  let site: string;

  beforeEach(() => {
    site = join(root, 'getbrewpath');
    git(root, 'init', '--quiet', site);
    commitFile(site, 'README.md', '# BrewPath site');
  });

  it('is the brewpath folder beside the site’s folder', () => {
    expect(appClonePath(site)).toBe(join(root, 'brewpath'));
  });

  it('is the same from a worktree inside the site’s folder', () => {
    const worktree = join(site, '.claude', 'worktrees', 'feat');
    git(site, 'worktree', 'add', '--quiet', '-b', 'feat', worktree);

    expect(appClonePath(worktree)).toBe(join(root, 'brewpath'));
  });

  it('is the same from a worktree beside the site’s folder', () => {
    const worktree = join(root, 'getbrewpath-feat');
    git(site, 'worktree', 'add', '--quiet', '-b', 'feat', worktree);

    expect(appClonePath(worktree)).toBe(join(root, 'brewpath'));
  });
});

describe('fetchAppMainFiles', () => {
  it('reads main on GitHub and ignores the app clone’s checked-out branch and uncommitted edits', () => {
    const app = cloneApp();
    git(app, 'switch', '--quiet', '-c', 'unreleased');
    commitFile(app, FREE_TIER_FILE, freeTier(5));
    writeFileSync(join(app, FREE_TIER_FILE), freeTier(9));

    expect(fetchAppMainFiles(app).readFile(FREE_TIER_FILE)).toBe(freeTier(2));
  });

  it('fetches main first, so a change pushed from another clone is read', () => {
    const app = cloneApp();
    const pushedCommit = pushFromAnotherClone(4);

    const appMainFiles = fetchAppMainFiles(app);

    expect(appMainFiles.readFile(FREE_TIER_FILE)).toBe(freeTier(4));
    expect(appMainFiles.commit).toBe(pushedCommit);
  });

  it('fetches main even when the clone is set to fetch only another branch', () => {
    const app = cloneApp();
    git(app, 'config', 'remote.origin.fetch', '+refs/heads/other:refs/remotes/origin/other');
    pushFromAnotherClone(4);

    expect(fetchAppMainFiles(app).readFile(FREE_TIER_FILE)).toBe(freeTier(4));
  });

  it('names the folder it looked in when there is no app clone', () => {
    const missing = join(root, 'brewpath');

    expect(() => fetchAppMainFiles(missing)).toThrow(`No app clone at ${missing}`);
  });

  it('gives git’s reason when GitHub cannot be reached', () => {
    const app = cloneApp();
    git(app, 'remote', 'set-url', 'origin', join(root, 'gone.git'));

    expect(() => fetchAppMainFiles(app)).toThrow(`git fetch failed in ${app}`);
  });
});
