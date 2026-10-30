import { describe, expect, it } from 'vitest';

import { processFolders, smokeTestsMustStop } from './preview-port';

const THIS_FOLDER = '/projects/getbrewpath';
const OTHER_WORKTREE = '/projects/getbrewpath-preview-check';

describe('processFolders', () => {
  it('reads the folder of every process lsof lists', () => {
    // Output of `lsof -a -d cwd -Fn -p <two process IDs>` on macOS.
    const output = `p34289\nfcwd\nn${OTHER_WORKTREE}\np34290\nfcwd\nn/private/tmp\n`;

    expect(processFolders(output)).toEqual([OTHER_WORKTREE, '/private/tmp']);
  });
});

describe('smokeTestsMustStop', () => {
  it('stops for a preview from this folder', () => {
    expect(smokeTestsMustStop([THIS_FOLDER], THIS_FOLDER)).toBe(true);
  });

  it('stops when one of several listeners runs from this folder', () => {
    expect(smokeTestsMustStop([OTHER_WORKTREE, THIS_FOLDER], THIS_FOLDER)).toBe(true);
  });

  it('stops when no folder was found', () => {
    expect(smokeTestsMustStop([], THIS_FOLDER)).toBe(true);
  });

  it('goes on for a preview from another worktree', () => {
    expect(smokeTestsMustStop([OTHER_WORKTREE], THIS_FOLDER)).toBe(false);
  });
});
