import stylistic from '@stylistic/eslint-plugin';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults';
import { MatcherType, SelectorKind } from 'eslint-plugin-better-tailwindcss/types';
import unusedImports from 'eslint-plugin-unused-imports';

/**
 * Short names allowed despite `id-length`: a loop index, an unused slot, an id, `cn` (the
 * helper that joins class names) and Node's file-system module.
 */
const SHORT_NAMES = ['i', '_', 'id', 'cn', 'fs'];

/**
 * Where the Tailwind checks look for classes, besides `className` and `cn(...)`: a constant whose
 * name ends in `Class`, `Classes`, `_CLASS` or `_CLASSES`, in its strings, object values and the
 * strings a function assigned to it returns.
 */
const CLASS_CONSTANTS = {
  kind: SelectorKind.Variable,
  name: '^(?:[a-z][A-Za-z]*Class(?:es)?|[A-Z][A-Z_]*_CLASS(?:ES)?)$',
  match: [
    { type: MatcherType.String },
    { type: MatcherType.ObjectValue },
    { type: MatcherType.AnonymousFunctionReturn, match: [{ type: MatcherType.String }] },
  ],
};

/** Styling is Tailwind classes; `style` is only for a value the browser works out (AGENTS.md). */
const STYLE_ATTRIBUTE = {
  selector: "JSXAttribute[name.name='style']",
  message:
    'Use classes. style is allowed only in the files eslint.config.mjs lists, for values the browser works out.',
};

/**
 * The files that may set `style`: each passes a value the browser works out while the page
 * runs (a measured scale, a random path), or feeds a renderer that reads only `style`.
 */
const STYLE_FILES = [
  'src/app/components/scaled-frame/scaled-frame.tsx',
  'src/app/components/home/coffee-burst.tsx',
  'src/app/components/og/og-image.tsx',
];

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
          // 2 is allowed for halves and doubles, 100 for turning a share into a percentage.
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
    plugins: { 'better-tailwindcss': betterTailwindcss },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/app/globals.css',
        // Classes defined in globals.css, such as `ff-ui`, count as known.
        detectComponentClasses: true,
        rootFontSize: 16,
        selectors: [...getDefaultSelectors(), CLASS_CONSTANTS],
      },
    },
    rules: {
      'no-restricted-syntax': ['error', STYLE_ATTRIBUTE],
      // Tailwind generates CSS only for class names it finds written out in full. A name built
      // with `${…}` or `+`, such as `w-[${size}px]`, gets no CSS and no warning.
      'better-tailwindcss/no-concatenated-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-unknown-classes': 'error',
      'better-tailwindcss/enforce-shorthand-classes': 'error',
      // Tailwind itself picks the canonical class, so a custom value it keeps has no equal.
      'better-tailwindcss/enforce-canonical-classes': 'warn',
    },
  },
  {
    // Tests state their expected values inline. Roasty, the flavour stamp and the lesson
    // progress bar's bean are drawings, and their numbers are coordinates. The app repo's
    // analysis_options.yaml exempts its drawing code the same way.
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      'e2e/**',
      'src/app/components/brewpath/roasty/roasty.tsx',
      'src/app/components/brewpath/reward-card/flavor-stamp.tsx',
      'src/app/components/brewpath/progress-topbar/progress-topbar.tsx',
    ],
    rules: { '@typescript-eslint/no-magic-numbers': 'off' },
  },
  {
    files: STYLE_FILES,
    rules: { 'no-restricted-syntax': 'off' },
  },
  { ignores: ['.next/**', 'node_modules/**', 'prototype/**', 'next-env.d.ts'] },
  prettier,
  {
    // After `prettier`, which turns these off. Every branch body in braces on its own line,
    // one statement per line; Prettier then puts each body on its own line.
    rules: {
      curly: ['error', 'all'],
      '@stylistic/max-statements-per-line': ['error', { max: 1 }],
    },
  },
];

export default eslintConfig;
