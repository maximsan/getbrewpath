## Adding a language

[en18.md](/docs/en18.md)

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

Security configuration and reporting are in [SECURITY.md](SECURITY.md). The
[security and Coffee Card review](docs/security-and-card-review.md) records the
implementation evidence, audit limits and remaining publication/launch checks.
