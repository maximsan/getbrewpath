import path from 'node:path';

const relative = (files) => files.map((file) => path.relative(process.cwd(), file)).join(' ');

const config = {
  '*.{js,mjs,ts,tsx}': (files) => [
    `pnpm exec eslint --fix ${relative(files)}`,
    `pnpm exec prettier --write ${relative(files)}`,
  ],
  '*.{json,css,md,yml}': (files) => `pnpm exec prettier --write ${relative(files)}`,
};

export default config;
