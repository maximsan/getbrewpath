# getbrewpath.com

The website for BrewPath, the coffee-learning iPhone app: the landing page,
shared Coffee Card pages, support, press kit and the legal documents.

Next.js (App Router) with TypeScript, Tailwind CSS and next-intl. Hosted on Vercel.

## Commands

```sh
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint
pnpm type-check
pnpm test
pnpm build
pnpm sync-cards     # refresh src/content/course.json from ../brewpath
```

## Where things live

- `src/app/` — routes and their components. `components/brewpath/` holds the
  app's design-system components, ported from the app prototype.
- `src/domains/` — product facts: the course and its cards, links, prices,
  support-message rules.
- `src/messages/en/` — every English string.
- `src/content/course.json` — written by `pnpm sync-cards` from the app repo's
  generated content; do not edit by hand.
- `prototype/` — the design this site was built from.

## Environment

Copy `.env.example` to `.env.local`. The support form needs `RESEND_API_KEY`;
without it the form shows that sending failed.

## Universal links

`/.well-known/apple-app-site-association` vouches for the app on this domain.
The app currently claims `brewpath.maximsan.dev`, so "Open in the app" on a
card page links there (see `src/domains/site/site.ts`).
