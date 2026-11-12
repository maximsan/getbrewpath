# getbrewpath.com

The website for BrewPath, the coffee-learning iPhone app.

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
pnpm sync-cards     # refresh course.json and card-art.json from the app's main branch on GitHub
                    # it fetches main into your clone of the app repo, which it expects beside this repo:
                    #   projects/getbrewpath/   this repo
                    #   projects/brewpath/      the app repo
                    # every worktree of this repo uses that same clone; `pnpm sync-cards <path>` uses a clone kept elsewhere
```

## Where things live

- `src/app/` — routes and their components.
- `components/brewpath/` holds the app's design-system components, ported from the app prototype.
- `src/domains/` — product facts: the course and its cards, links, email addresses.
- `src/app/[locale]/` — the pages, once per language.
- `src/i18n/` — the language list, routing and string loading.
- `src/messages/<language>/` — every string, one folder per language.
- `src/content/<language>/course.json` and `card-art.json` — written by
  `pnpm sync-cards` from the app repo's content, SVG drawings and fonts; do not
  edit by hand. Artwork includes both moods, with labels outlined so it does not
  depend on browser fonts.
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

Terms are defined in [GLOSSARY.md](GLOSSARY.md).
