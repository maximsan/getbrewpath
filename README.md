# getbrewpath.com

The website for BrewPath, the coffee-learning iPhone app: the landing page,
shared Coffee Card pages and the legal documents. Support is by email; the
address is `EMAIL_HI` in `src/domains/site/site.ts`.

Next.js (App Router) with TypeScript, Tailwind CSS and next-intl.

## Commands

```sh
pnpm install
pnpm exec playwright install chromium   # once, for pnpm test:smoke
pnpm dev            # http://localhost:3000
pnpm lint
pnpm type-check
pnpm test
pnpm build
pnpm preview        # build for Cloudflare and serve it locally, http://localhost:8787
pnpm run deploy     # build for Cloudflare and put it live; CI runs it on every push to main
                    # `pnpm deploy` without `run` is a different, built-in pnpm command
pnpm test:smoke     # build the site, open its main pages in Chromium and check them
                    # refuses to start while pnpm preview runs from this folder: the rebuild would crash that preview
                    # a preview running from another folder, such as another git worktree, is left alone
                    # before a push that changes more than Markdown, docs/, .github/ or prototype/,
                    # the pre-push hook runs pnpm lint, pnpm type-check and pnpm test:smoke
pnpm lighthouse     # page speed score (0–100) per page, the middle of several runs; needs pnpm preview running
                    # compare middle scores: one run's score can vary by ten points or more
                    # --check exits with an error when a page scores below its minimum
pnpm sync-cards     # refresh src/content/<language>/course.json from the app's main branch on GitHub
                    # it fetches main into your clone of the app repo, which it expects beside this repo:
                    #   projects/getbrewpath/   this repo
                    #   projects/brewpath/      the app repo
                    # every worktree of this repo uses that same clone; `pnpm sync-cards <path>` uses a clone kept elsewhere
```

## Where things live

- `src/app/` — routes and their components. `components/brewpath/` holds the
  app's design-system components, ported from the app prototype.
- `src/domains/` — product facts: the course and its cards, links, email addresses.
- `src/app/[locale]/` — the pages, once per language.
- `src/i18n/` — the language list, routing and string loading.
- `src/messages/<language>/` — every string, one folder per language.
- `src/content/<language>/course.json` — written by `pnpm sync-cards` from the
  app repo's content; do not edit by hand.
- `src/assets/` — the app icon, and app screenshots in `screens/<mood>/`, one
  folder per [mood](GLOSSARY.md). Pages import them, so their addresses carry a
  content hash and browsers cache them for a year.
- `public/legal/` — the app's Terms of Use and Privacy Policy, as PDF files.
  The `/terms` and `/privacy` pages show the same text word for word. The text
  lives under the `docs` key of `src/messages/en/site.json`. Each file's date,
  contact address and path are in `src/domains/site/legal-docs.ts`. When a PDF
  changes, update both; `pnpm test` fails until the pages match the files.
  The owner edits the PDF files. When the page's wording changes before the PDF
  does, list the change in `pendingFileEdits` in `legal-docs.ts`. Also list it in
  one open ticket for the owner, so each PDF gets all its changes in one pass.

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

## Screenshots

Each mood shows its own screenshots. Both folders in `src/assets/screens/`
hold every screen in `SCREENS` (`src/domains/site/screens.ts`) under the same
file names. `src/app/components/phone-shot/phone-shot.tsx` imports each one, so
the build fails if a folder misses one.

## Universal links

`/.well-known/apple-app-site-association` tells iOS which links open the
BrewPath app: card links, `/card/<id>`, on `getbrewpath.com` and on
`open.getbrewpath.com`. Every other address stays on the site.

"Open in the app" on a card page links to `open.getbrewpath.com`, because iOS
ignores a link tapped on a page of the same domain. That domain serves only
the Apple link file and redirects everything else, as `next.config.ts`
describes. See `src/domains/site/site.ts`.

## Hosting

The site runs on Cloudflare as the Worker `getbrewpath`, set up in
`wrangler.jsonc`. A Worker is the program Cloudflare runs to answer a domain.
It serves `getbrewpath.com` and `open.getbrewpath.com`.

`www.getbrewpath.com` is not in the code. A Cloudflare redirect rule sends it to
the same path on `getbrewpath.com`: Cloudflare dashboard → getbrewpath.com →
Rules → Redirect Rules.
