import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromRoot = (dir: string) => fileURLToPath(new URL(dir, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@domains': fromRoot('./src/domains'),
      '@shared': fromRoot('./src/shared'),
      '@content': fromRoot('./src/content'),
      '@messages': fromRoot('./src/messages'),
    },
  },
  test: { include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'] },
});
