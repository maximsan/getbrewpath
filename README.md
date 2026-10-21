# getbrewpath.com

The website for BrewPath, the coffee-learning iPhone app: the landing page,
shared Coffee Card pages, support, press kit and the legal documents.

Next.js (App Router) with TypeScript, Tailwind CSS and next-intl.

## Commands

```sh
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint
pnpm type-check
pnpm test
pnpm build
pnpm sync-cards     # refresh src/content/<language>/course.json from ../brewpath
```

## Where things live

- `src/app/` — routes and their components. `components/brewpath/` holds the
  app's design-system components, ported from the app prototype.
- `src/domains/` — product facts: the course and its cards, links,
  support-message rules.
- `src/app/[locale]/` — the pages, once per language.
- `src/i18n/` — the language list, routing and string loading.
- `src/messages/<language>/` — every string, one folder per language.
- `src/content/<language>/course.json` — written by `pnpm sync-cards` from the
  app repo's content; do not edit by hand.
- `public/images/screens/<mood>/` — app screenshots, one folder per
  [mood](GLOSSARY.md).
- `public/legal/` — the app's Terms of Use and Privacy Policy, as PDF files.
  The `/terms` and `/privacy` pages show the same text word for word. The text
  lives under the `docs` key of `src/messages/en/site.json`. Each file's date,
  contact address and path are in `src/domains/site/legal-docs.ts`. When a PDF
  changes, update both; `pnpm test` fails until the pages match the files.

Terms such as Foundations and Module Reward are defined in [GLOSSARY.md](GLOSSARY.md).

## Adding a language

English keeps the bare addresses (`/terms`); another language is served under
its code (`/be/terms`).

1. Add the code to `locales` and its name to `LOCALE_NAMES` in `src/i18n/routing.ts`.
2. Copy `src/messages/en/` to `src/messages/<code>/` and translate it. Add the
   folder to `MESSAGES` in `src/i18n/messages.ts`.
3. Run `pnpm sync-cards`. It writes the course in that language from the app's
   `assets/content/l10n/<code>/`. Add the file to `COURSE_FILES` in
   `src/domains/course/course.ts`.
4. Pick a headline serif that covers the language's script and add it to
   `DISPLAY_FONT` in `src/app/fonts.ts`. Fraunces has Latin letters only.

The type check fails until steps 1–4 are all done. `pnpm test` fails if the new
strings have a key English lacks, or lack one English has.

The `docs` strings are the legal documents. `pnpm test` compares only the
English pages with the PDF files in `public/legal/`.

## Selling model

`SELLING_MODEL` in `src/domains/site/site.ts` sets how Foundations is sold:
`oneTime`, `subscription` or `hybrid`. The pricing section, FAQ, support steps
and press facts all follow it. The site shows no prices: the app shows them.

## Screenshots

Each mood shows its own screenshots. Both folders in `public/images/screens/`
hold every screen in `SCREENS` (`src/domains/site/screens.ts`) under the same
file names. `pnpm test` fails if a folder misses one.

## Environment

Copy `.env.example` to `.env.local`. The support form needs `RESEND_API_KEY`;
without it the form shows that sending failed.

## Universal links

`/.well-known/apple-app-site-association` tells iOS that the BrewPath app may
open links to this domain. The app is set up to open links from
`brewpath.maximsan.dev` only, so "Open in the app" on a card page links there.
See `src/domains/site/site.ts`.
