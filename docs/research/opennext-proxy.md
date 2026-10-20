# Is OpenNext's support for proxy.ts safe to launch on?

Research for [issue #8](https://github.com/maximsan/getbrewpath/issues/8), part of [#3](https://github.com/maximsan/getbrewpath/issues/3). Sources checked on 2026-10-20.

## Short answer

OpenNext's support for `proxy.ts` works, but it is labelled experimental, and no stable version is announced. None of its open bugs hit this site's setup. Our proxy does only two address mappings. `next.config.ts` can express both mappings, so the site can likely drop the proxy entirely. That last point is not confirmed by a build yet.

## Words used here

- **OpenNext** is the adapter that turns a Next.js build into a Cloudflare Worker. Its package is `@opennextjs/cloudflare`.
- **A Worker** is the program Cloudflare runs for each request to the site.
- **The proxy** is `src/proxy.ts`. Next.js runs it before every matching request. Next.js 15 called this file `middleware.ts`.
- **A runtime** is the environment code runs in. The Node.js runtime offers Node's full set of built-in modules. The edge runtime is a smaller, web-standard subset.
- **A rewrite** serves one address's content under another address. The visitor's address bar does not change.
- **A redirect** tells the browser to load a different address.
- **The bundle** is the code uploaded to Cloudflare as the Worker.

## What our proxy does

The proxy is one line: `createMiddleware(routing)` from next-intl, the translation library. See `src/proxy.ts` on `feat/locales-selling-models-moods`.

The routing settings are in `src/i18n/routing.ts` on the same branch:

- `localePrefix: 'as-needed'`: English has no prefix (`/terms`), other languages do (`/be/terms`).
- `localeDetection: false`: the site never picks a language from the browser.
- `localeCookie: false`: the site stores no language cookie.

With these settings, the next-intl proxy does three things:

1. It rewrites a bare address to the English folder: `/terms` serves `/en/terms`.
2. It redirects a redundant prefix away: `/en/terms` goes to `/terms`. ([next-intl: as-needed](https://next-intl.dev/docs/routing/configuration#locale-prefix-as-needed))
3. It adds a `link` response header listing each page's other languages for search engines. ([next-intl: alternate links](https://next-intl.dev/docs/routing/configuration#alternate-links))

The site already lists other languages without the proxy. Each page's metadata sets `alternates.languages`, and the sitemap does too. See `src/domains/site/page-metadata.ts` and `src/app/sitemap.ts` on the same branch.

Every page is pre-built. The layout sets `generateStaticParams` and `dynamicParams = false`, and calls `setRequestLocale`. See `src/app/[locale]/layout.tsx` and `src/i18n/page-locale.ts`.

## Why proxy.ts runs in Node.js

Next.js 16 runs `proxy.ts` only in the Node.js runtime. Setting another runtime in it throws an error. ([Next.js: proxy.js, Runtime](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#runtime))

The old `middleware.ts` still works for the edge runtime in Next.js 16. It is deprecated and "will be removed in a future version". No removal version is given. ([Next.js 16 release post](https://nextjs.org/blog/next-16#proxyts-formerly-middlewarets))

## History of OpenNext's support

- Next.js 16 shipped in October 2025. OpenNext then refused to build a `proxy.ts` app. ([issue #962](https://github.com/opennextjs/opennextjs-cloudflare/issues/962), [PR #978](https://github.com/opennextjs/opennextjs-cloudflare/pull/978))
- A maintainer said proxy support would come with OpenNext's move to the Next.js Adapters API. The Adapters API is Next.js's new interface for hosting platforms. ([issue #972](https://github.com/opennextjs/opennextjs-cloudflare/issues/972))
- An outside contributor wrote the support instead. The maintainers merged it as [PR #1309](https://github.com/opennextjs/opennextjs-cloudflare/pull/1309) on 2026-08-25. It shipped in version 1.20.3. ([changelog](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/CHANGELOG.md))
- The changelog calls the support "experimental". It requires Cloudflare's `nodejs_compat` setting. ([changelog, 1.20.3](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/CHANGELOG.md))
- The build prints: "Node.js middleware support is experimental in cloudflare, and not officially maintained by OpenNext maintainers. Use at your own risk." ([`build.ts`](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/src/cli/build/build.ts))
- Fixes keep landing. Version 1.20.11 stopped bundling unused `@vercel/og` into the proxy. Version 1.20.12 added Next.js 16.4 support. ([changelog](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/CHANGELOG.md))
- The OpenNext docs still say Node middleware is "not yet supported". The changelog shows that sentence is out of date. ([OpenNext Cloudflare docs](https://opennext.js.org/cloudflare))

## Is a stable version planned?

No stable version or date is announced. I found no maintainer statement giving one.

The Adapters API work has its own copy of the support. It merged in the `adapters-api` repo on 2026-09-01. ([adapters-api PR #50](https://github.com/opennextjs/adapters-api/pull/50)) That repo has no releases. The published package still comes from the `opennextjs-cloudflare` repo. ([adapters-api releases](https://github.com/opennextjs/adapters-api/releases), [opennextjs-cloudflare releases](https://github.com/opennextjs/opennextjs-cloudflare/releases))

Not confirmed: whether the Adapters API release will drop the "experimental" label.

## Known open bugs

These issues are open on 2026-10-20:

- **Bundle size.** The proxy grows the bundle by about 4 megabytes (MB), even for an empty proxy. ([issue #1373](https://github.com/opennextjs/opennextjs-cloudflare/issues/1373)) Cloudflare's limit is 64 mebibytes (MiB) uncompressed on both plans. That is about 67 MB. ([Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/)) So it fits, but a larger Worker can start more slowly. (same source)
- **OpenTelemetry.** The build fails when `@opentelemetry/api` is installed, for example through Sentry. ([issue #1400](https://github.com/opennextjs/opennextjs-cloudflare/issues/1400), fix in [PR #1430](https://github.com/opennextjs/opennextjs-cloudflare/pull/1430)) This site has neither package. (`package.json` on the same branch)
- **Instrumentation.** An `instrumentation.ts` file can still run inside the proxy, and its imports can break the build. ([issue #1401](https://github.com/opennextjs/opennextjs-cloudflare/issues/1401), fix in [PR #1445](https://github.com/opennextjs/opennextjs-cloudflare/pull/1445)) This site has no `instrumentation.ts`. (file list of the same branch)
- **The original feature request** is still open. ([issue #617](https://github.com/opennextjs/opennextjs-cloudflare/issues/617))

None of these bugs affect what our proxy does. Our proxy rewrites and redirects; PR #1309's live tests covered both. ([PR #1309](https://github.com/opennextjs/opennextjs-cloudflare/pull/1309))

## The alternatives and what they cost

### A. Keep proxy.ts on OpenNext's experimental support

- Cost: about 4 MB more bundle. ([issue #1373](https://github.com/opennextjs/opennextjs-cloudflare/issues/1373))
- Cost: the maintainers call this path experimental and unmaintained. ([`build.ts`](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/src/cli/build/build.ts))
- Gain: no code change. The trial build worked. ([issue #8](https://github.com/maximsan/getbrewpath/issues/8))

### B. Rename back to middleware.ts and use the edge runtime

- Gain: OpenNext supports edge middleware without the experimental label. ([issue #972](https://github.com/opennextjs/opennextjs-cloudflare/issues/972))
- Gain: the bundle stays small. ([issue #1373](https://github.com/opennextjs/opennextjs-cloudflare/issues/1373))
- Cost: Next.js deprecated `middleware.ts` and will remove it later. ([Next.js 16 release post](https://nextjs.org/blog/next-16#proxyts-formerly-middlewarets))
- Cost: every build prints a deprecation warning. ([issue #962](https://github.com/opennextjs/opennextjs-cloudflare/issues/962))

### C. Drop the proxy and route in next.config.ts

`next.config.ts` can declare rewrites and redirects. Next.js runs them without a proxy. ([Next.js: rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)) The two mappings would be:

- A `beforeFiles` rewrite from a bare address to `/en/…`. It must skip addresses that start with another language code, `/_next`, and `/.well-known`. It must also skip files with an extension. Rewrite sources accept regular expressions. (same source)
- A redirect from `/en` and `/en/…` to the bare address.

Rewrites also apply when a visitor clicks a link inside the site. (same source)

What this costs or breaks:

- The `link` header with other languages disappears. The page metadata and the sitemap already list them, so search engines keep the information. (`page-metadata.ts`, `sitemap.ts` on the same branch)
- next-intl documents running without a proxy only for static export, and only with a prefix on every language. ([next-intl: usage without proxy](https://next-intl.dev/docs/routing/middleware#usage-without-middleware-static-export)) Bare English addresses without a proxy are not documented. Not confirmed: that next-intl's `usePathname` and `Link` behave the same.
- The footer's language links point to `/en/…` when switching to English. next-intl expects the proxy to redirect that. ([next-intl: Link with a locale](https://next-intl.dev/docs/routing/navigation#link-locale), `language-links.tsx` on the same branch) The redirect in `next.config.ts` would take over that job.
- Every new language needs its code added to the rewrite's exclusion list. Otherwise `/be/terms` would be rewritten to `/en/be/terms`.
- Two open OpenNext bugs involve rewrites. One is a rewrite to an external site. ([issue #594](https://github.com/opennextjs/opennextjs-cloudflare/issues/594)) The other is a rewrite that matches on the host name. ([issue #1323](https://github.com/opennextjs/opennextjs-cloudflare/issues/1323)) Neither is a plain path rewrite like ours. Not confirmed: that plain path rewrites work on OpenNext; the trial build did not test them.

### D. Prefix every language, English included

This is next-intl's documented setup without a proxy. ([next-intl: usage without proxy](https://next-intl.dev/docs/routing/middleware#usage-without-middleware-static-export)) It changes every English address to `/en/…`. The bare `/terms` would need a redirect. This contradicts the routing decision recorded in `src/i18n/routing.ts`.

## Recommendation

Try alternative C first: replace the proxy with one rewrite and one redirect in `next.config.ts`. Our proxy does nothing else the site needs. Language detection and the cookie are off. The page metadata already lists the other languages. Dropping the proxy removes the experimental code path, about 4 MB of bundle, and one step on every request. Prove it with a trial build on Cloudflare's runtime. Check bare English pages, a redundant `/en/…` address, share images, the 404 page and in-site navigation. If any check fails, launch on alternative A instead. Pin `@opennextjs/cloudflare` to at least 1.20.12 for Next.js 16.4 support. Keep alternative B only as an emergency fallback, since Next.js will remove `middleware.ts`.

## Open decisions for the owner

1. Which alternative to build: C with A as fallback (recommended), A alone, or B.
2. Whether a failed trial of C blocks launch, or the site launches on A and C waits for later.
