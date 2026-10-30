import { execFileSync, spawnSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

describe('credential file exclusions', () => {
  it('ignores environment files and signing credentials before they can be staged', () => {
    const files = [
      '.env',
      '.env.local',
      '.env.production',
      '.env.test',
      'credentials/signing.key',
      'credentials/signing.pem',
      'credentials/auth.p8',
      'credentials/signing.p12',
      'credentials/signing.pfx',
    ];
    const ignored = execFileSync('git', ['check-ignore', '--no-index', ...files], {
      encoding: 'utf8',
    })
      .trim()
      .split('\n');

    expect(ignored).toEqual(files);
  });

  it('allows an environment example with placeholder values', () => {
    const result = spawnSync('git', ['check-ignore', '--no-index', '.env.example']);

    expect(result.status).toBe(1);
  });
});
