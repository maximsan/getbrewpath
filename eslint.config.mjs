import stylistic from '@stylistic/eslint-plugin';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import tailwindcss from 'eslint-plugin-tailwindcss';
import unusedImports from 'eslint-plugin-unused-imports';

/**
 * Short names allowed despite `id-length`: a loop index, an unused slot, an id, the class
 * joiner every component imports, and Node's file-system module.
 */
const SHORT_NAMES = ['i', '_', 'id', 'cn', 'fs'];

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    plugins: { 'unused-imports': unusedImports, '@stylistic': stylistic },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],

      // A blank line before leaving a block, and after the declarations that open one.
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['return', 'continue', 'break'] },
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
      ],
      'id-length': ['error', { min: 3, properties: 'never', exceptions: SHORT_NAMES }],
      '@typescript-eslint/no-magic-numbers': [
        'warn',
        {
          // 2 halves or doubles, 100 turns a share into a percentage.
          ignore: [-1, 0, 1, 2, 100],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          enforceConst: true,
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { tailwindcss },
    settings: {
      tailwindcss: {
        callees: ['cn'],
        cssConfigPath: './src/app/globals.css',
      },
    },
    rules: {
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/no-contradicting-classname': 'error',
      // Off: it reads Tailwind 4 wrongly, e.g. it turns `leading-[1.15]` (a line height of
      // 1.15) into `leading-1.15` (1.15 spacing steps) and `scale-[1.035]` into 1.035%.
      'tailwindcss/no-unnecessary-arbitrary-value': 'off',
    },
  },
  {
    // Tests state their expected values inline. The design system's drawings are coordinates,
    // as the app repo's drawing code is (its analysis_options.yaml exempts them the same way).
    files: ['**/*.test.ts', '**/*.test.tsx', 'e2e/**', 'src/app/components/brewpath/**'],
    rules: { '@typescript-eslint/no-magic-numbers': 'off' },
  },
  { ignores: ['.next/**', 'node_modules/**', 'prototype/**', 'next-env.d.ts'] },
  prettier,
  {
    // After `prettier`, which turns these off. Every branch body in braces on its own line,
    // one statement per line; Prettier then puts each body on its own line.
    plugins: { '@stylistic': stylistic },
    rules: {
      curly: ['error', 'all'],
      '@stylistic/max-statements-per-line': ['error', { max: 1 }],
    },
  },
];

export default eslintConfig;
