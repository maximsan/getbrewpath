# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, used through `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels, each named after its role. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Working in this repo

`README.md` holds the commands, where things live and the how-tos. Terms such as Coffee Card and mood are in `GLOSSARY.md`.

- Before opening a PR, run the checks CI runs (`.github/workflows/ci.yml`).
- Run one test file with `pnpm test <path>`, one test with `pnpm test -t "<test name>"`.
- Import aliases live in `tsconfig.json`. `vitest.config.ts` maps only some of them; add an alias there when a tested module imports it.
- Product facts come from the app repo; the README's `pnpm sync-cards` line shows where its clone goes. The course content arrives through `pnpm sync-cards`; the design components were ported from `prototype/`, a design export kept as reference and skipped by lint.
- Style with Tailwind classes. `src/app/globals.css` holds the rest:
  - colours, fonts and every `@keyframes`;
  - each animation, named once as an `--animate-*` token;
  - each fixed size, as a token such as `--aspect-phone`, used as the class `aspect-phone`.
- A fixed value for one element is a class written out in full, such as `[--start-delay:600ms]`. Tailwind generates CSS only for class names written out in full, so join classes with `cn(...)`, never with `${…}` or `+`.
- `style` is allowed only in the files `eslint.config.mjs` lists. Each passes a value the browser works out while the page runs, such as a measured scale, or draws a share image, whose renderer reads only `style`.
