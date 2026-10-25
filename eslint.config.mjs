import stylistic from '@stylistic/eslint-plugin';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import unusedImports from 'eslint-plugin-unused-imports';

/**
 * Short names allowed despite `id-length`: a loop index, an unused slot, an id, `cn` (the
 * helper that joins class names) and Node's file-system module.
 */
const SHORT_NAMES = ['i', '_', 'id', 'cn', 'fs'];

/**
 * Tailwind generates CSS only for class names it finds written out in the source. A name
 * assembled while the page runs, such as `w-[${size}px]`, silently gets no CSS, so class
 * names are joined whole, with `cn(...)`.
 */
const CLASS_NAME_PLACES = [
  "JSXAttribute[name.name='className']",
  "CallExpression[callee.name='cn']",
];
/** A `${…}` template, or a `+` with a string on either side. */
const ASSEMBLED_STRINGS = [
  'TemplateLiteral[expressions.length>0]',
  "BinaryExpression[operator='+']:matches([left.type='TemplateLiteral'], [right.type='TemplateLiteral'], [left.raw=/^['\"]/], [right.raw=/^['\"]/])",
];
const ASSEMBLED_CLASS_NAMES = CLASS_NAME_PLACES.flatMap((place) =>
  ASSEMBLED_STRINGS.map((assembled) => ({
    selector: `${place} ${assembled}`,
    message: 'Join whole class names with cn(...); Tailwind misses a name built with ${…} or +.',
  })),
);

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
      },
    },
    rules: {
      'no-restricted-syntax': ['error', ...ASSEMBLED_CLASS_NAMES, STYLE_ATTRIBUTE],
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
    rules: { 'no-restricted-syntax': ['error', ...ASSEMBLED_CLASS_NAMES] },
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
