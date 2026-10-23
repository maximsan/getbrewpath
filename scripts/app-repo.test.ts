import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { defaultAppRepo, fetchAppMain } from './app-repo';

const FREE_TIER_FILE = 'assets/content/generated/website/free_tier.json';

let root: string;

const git = (cwd: string, ...args: string[]) =>
  execFileSync(
    'git',
    [
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.com',
      '-c',
      'commit.gpgsign=false',
      ...args,
    ],
    { cwd, encoding: 'utf8', stdio: 'pipe' },
  );

/** Writes `text` to `file` in the checkout at `dir` and commits it. */
function commitFile(dir: string, file: string, text: string) {
  mkdirSync(join(dir, file, '..'), { recursive: true });
  writeFileSync(join(dir, file), text);
  git(dir, 'add', file);
  git(dir, 'commit', '-m', `write ${file}`);
}

/** An app repo on GitHub, as a bare repo, and its checkout at `<root>/brewpath`. */
function cloneApp() {
  const origin = join(root, 'origin.git');
  git(root, 'init', '--bare', '-b', 'main', origin);
  const app = join(root, 'brewpath');
  git(root, 'clone', '--quiet', origin, app);
  commitFile(app, FREE_TIER_FILE, '{"daily":3}');
  git(app, 'push', '--quiet', 'origin', 'main');
  return app;
}

beforeEach(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'app-repo-')));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('defaultAppRepo', () => {
  beforeEach(() => {
    const site = join(root, 'getbrewpath');
    git(root, 'init', '--quiet', '-b', 'main', site);
    commitFile(site, 'README.md', 'site');
  });

  it('finds the app repo next to the site’s main folder', () => {
    expect(defaultAppRepo(join(root, 'getbrewpath'))).toBe(join(root, 'brewpath'));
  });

  it('finds the same app repo from a worktree inside the main folder', () => {
    const worktree = join(root, 'getbrewpath', '.claude', 'worktrees', 'feat');
    git(join(root, 'getbrewpath'), 'worktree', 'add', '--quiet', '-b', 'feat', worktree);

    expect(defaultAppRepo(worktree)).toBe(join(root, 'brewpath'));
  });
});

describe('fetchAppMain', () => {
  it('reads main on GitHub, not the branch or uncommitted edits in the app’s folder', () => {
    const app = cloneApp();
    git(app, 'switch', '--quiet', '-c', 'unreleased');
    commitFile(app, FREE_TIER_FILE, '{"daily":5}');
    writeFileSync(join(app, FREE_TIER_FILE), '{"daily":9}');

    expect(fetchAppMain(app).readFile(FREE_TIER_FILE)).toBe('{"daily":3}');
  });

  it('fetches main first, so a change pushed from elsewhere is read', () => {
    const app = cloneApp();
    const otherClone = join(root, 'other');
    git(root, 'clone', '--quiet', join(root, 'origin.git'), otherClone);
    commitFile(otherClone, FREE_TIER_FILE, '{"daily":4}');
    git(otherClone, 'push', '--quiet', 'origin', 'main');

    const appMain = fetchAppMain(app);

    expect(appMain.readFile(FREE_TIER_FILE)).toBe('{"daily":4}');
    expect(appMain.commit).toBe(git(otherClone, 'rev-parse', 'HEAD').trim());
  });

  it('names the folder it looked in when there is no app repo', () => {
    const missing = join(root, 'brewpath');

    expect(() => fetchAppMain(missing)).toThrow(`No app repo at ${missing}`);
  });
});
