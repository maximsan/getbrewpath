# Why does Cloudflare draw share images on every visit?

Research for [issue #15](https://github.com/maximsan/getbrewpath/issues/15), part of [#3](https://github.com/maximsan/getbrewpath/issues/3). Sources checked on 2026-10-22. Terms such as share image and Coffee Card are defined in [GLOSSARY.md](../../GLOSSARY.md).

## Short answer

Two separate causes, both reproduced in a local OpenNext build of `main`:

1. **The OpenNext cache was empty.** OpenNext serves a stored share image only from its incremental cache. With no cache configured, nothing is stored. A configured static-assets cache stays empty until `populateCache` runs. `wrangler deploy` alone skips that step.
2. **Coffee Card share images are never stored at build time.** Their `generateStaticParams` returns only the card `id`, without `locale`. `next build` then prerenders zero card share images. Only the site's own share image is stored.

The fix needs both changes:

- Configure the static-assets cache and deploy with `opennextjs-cloudflare deploy`, which fills it.
- Make the card share image's `generateStaticParams` return `locale` and `id` together.

With both changes, the local Worker served every share image from the cache, with no drawing. Drawing one image per visit took about 40 ms locally. The Workers Free plan allows 10 ms of processor time per request. So per-visit drawing most likely does not fit Free. That last point is not measured on Cloudflare itself.

## Words used here

- **OpenNext** is the adapter that turns a Next.js build into a Cloudflare Worker. Its package is `@opennextjs/cloudflare`.
- **A Worker** is the program Cloudflare runs for each request to the site.
- **Prerendering** means drawing a page or image during `next build` and storing the result.
- **The incremental cache** is where OpenNext keeps prerendered results for the Worker to serve. OpenNext offers several stores for it: R2 (Cloudflare's file storage), Workers KV (Cloudflare's key-value store), or the Worker's static assets.
- **The static-assets cache** is the read-only store. It keeps build-time results as files inside the Worker's static assets.
- **`populateCache`** is the OpenNext command that copies build results into the chosen cache store.
- **CPU time** (central processing unit time) is the time the processor spends running the Worker's code. Waiting on the network does not count.

## How the site's share images are built

Two files draw share images. Both export `generateStaticParams`:

- `src/app/[locale]/opengraph-image.tsx` uses `localeRouteParams`, which returns `{ locale }`.
- `src/app/[locale]/card/[id]/opengraph-image.tsx` uses `cardRouteParams`, which returns only `{ id }`. (`src/domains/course/course.ts:21`)

Both call `renderOgImage`, which reads the app icon from disk on each draw. (`src/app/components/og/og-image.tsx:10`) A Worker has no disk, so a draw on Cloudflare fails with a 500 error. ([issue #4](https://github.com/maximsan/getbrewpath/issues/4)) That makes the failure a reliable sign: a 500 means the Worker drew the image; a 200 means it served a stored copy.

Next.js says generated images are prerendered and cached by default. (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md:91` in Next.js 16.4.2; online: [Next.js: opengraph-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx))

## How I tested

I built `origin/main` with Next.js 16.4.2 and `@opennextjs/cloudflare` 1.20.13, the latest release. ([release](https://github.com/opennextjs/opennextjs-cloudflare/releases/tag/%40opennextjs%2Fcloudflare%401.20.13)) I ran the Worker locally with `wrangler dev`, which uses Cloudflare's runtime, workerd. None of this setup is committed.

| Setup                                       | `/opengraph-image`     | `/card/c1/opengraph-image` |
| ------------------------------------------- | ---------------------- | -------------------------- |
| No cache configured                         | 500, icon read failed  | 500, icon read failed      |
| Static-assets cache, not populated          | 500                    | 500                        |
| Static-assets cache, populated              | 200, served from cache | 500                        |
| Populated, and card params include `locale` | 200                    | 200                        |

The 500 errors logged `no such file or directory, readAll '/bundle/public/images/app-icon.png'`. That is the same error the trial build hit. ([issue #4](https://github.com/maximsan/getbrewpath/issues/4))

## Cause 1: the cache was empty

**No cache configured.** When `open-next.config.ts` sets no `incrementalCache`, OpenNext uses `"dummy"`. ([`config.ts:112`](https://github.com/opennextjs/opennextjs-cloudflare/blob/adb4f68c7c957be53412fba0c1d8266e81b27d28/packages/cloudflare/src/api/config.ts#L112)) The dummy cache "does not cache anything". ([`dummy.ts`](https://github.com/opennextjs/opennextjs-aws/blob/e829c037c79fc2a527af4d678651028cfd5929d6/packages/open-next/src/overrides/incrementalCache/dummy.ts)) So every request draws the image again.

**Static-assets cache configured but not populated.** `opennextjs-cloudflare build` writes the stored images to `.open-next/cache`. It does not copy them into the Worker's assets. The copy into `.open-next/assets/cdn-cgi/_next_cache` happens only in `populateCache`. ([`populate-cache.ts:802`](https://github.com/opennextjs/opennextjs-cloudflare/blob/adb4f68c7c957be53412fba0c1d8266e81b27d28/packages/cloudflare/src/cli/commands/populate-cache.ts#L802)) The `deploy`, `upload` and `preview` commands run `populateCache` for you. ([OpenNext CLI docs](https://opennext.js.org/cloudflare/cli#populatecache-command)) A plain `wrangler deploy` after `build` uploads an empty cache. I confirmed the folder is absent after `build` alone.

Not confirmed: which of these the trial build hit. The trial's config and deploy command are not recorded in the repo. Either one matches what the trial saw.

**An older OpenNext bug with the same symptom.** Next.js 16.3.8 changed the keys its cache uses for stored results. OpenNext versions up to 1.20.7 still stored results under the old keys, so every stored result was missed. The bug report describes an `opengraph-image.tsx` that read a file from `public/` and returned 500. ([opennextjs-aws issue #1269](https://github.com/opennextjs/opennextjs-aws/issues/1269)) It was fixed in `@opennextjs/aws` 4.1.7, shipped in `@opennextjs/cloudflare` 1.20.8 on 2026-10-02. ([aws changelog 4.1.7](https://github.com/opennextjs/opennextjs-aws/blob/main/packages/open-next/CHANGELOG.md#417), [cloudflare changelog 1.20.8](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/CHANGELOG.md#1208)) Version 1.20.13 stores the home share image under the new key, and serves it. Not confirmed: which OpenNext version the trial used.

## Cause 2: Coffee Card share images are never prerendered

The `next build` output lists the card share image route with no addresses under it:

```
├ ● /[locale]/card/[id]/opengraph-image
├   /[locale]/opengraph-image
│ └ ● /en/opengraph-image
```

The card pages themselves are prerendered (`/en/card/c1` and 36 more). They get `locale` from the `generateStaticParams` in `src/app/[locale]/layout.tsx`. Next.js passes a parent's params down to a child's `generateStaticParams`. (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md:68`; online: [Next.js: generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)) The share image route is a route handler, not a page. In this build it did not receive `locale` from the layout. With only `{ id }`, Next.js generated no card share images.

Not confirmed in the docs: that route handlers skip a layout's `generateStaticParams`. I found no sentence saying so. The build output above is the evidence.

Because nothing is stored, every card share image is drawn on request. This also explains why the static-assets cache did not help for card images. That cache is read-only, so it cannot keep a runtime draw either. ([`static-assets-incremental-cache.ts`](https://github.com/opennextjs/opennextjs-cloudflare/blob/adb4f68c7c957be53412fba0c1d8266e81b27d28/packages/cloudflare/src/api/overrides/incremental-cache/static-assets-incremental-cache.ts))

**The test fix.** I changed the card share image's `generateStaticParams` to add `locale: 'en'` to each card's params. The build then listed `/en/card/c1/opengraph-image` and 36 more. After `populateCache`, every card share image I requested returned 200 from the cache. A real fix should loop over `routing.locales` rather than hard-code English.

## Options checked

- **Static-assets cache.** OpenNext recommends it for a static site with no revalidation. ([OpenNext caching docs: SSG site](https://opennext.js.org/cloudflare/caching#ssg-site)) It suits this site, because every page and image is fixed at build time.
- **R2 or Workers KV cache.** These can also store images drawn at request time. They need a bucket or namespace, and a populate step at each deploy. ([OpenNext caching docs: initialize the cache](https://opennext.js.org/cloudflare/caching#4-initialize-the-cache-during-deployments)) They are not needed once every share image is prerendered.
- **`dynamic = 'force-static'`.** Not tested. The build already marks both routes as prerendered (●). The problem is missing params and an empty cache, which this setting does not change.
- **`dynamicParams = false`.** Not tested on these routes. Next.js documents it for route handlers. An address not listed by `generateStaticParams` would return 404 instead of being drawn. (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md`; online: [Next.js: dynamicParams](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams)) It would turn a forgotten param into a visible 404 rather than a silent draw.
- **Cache interception.** OpenNext can answer stored results before Next.js starts, through `dangerous.enableCacheInterception`. It is off by default. ([OpenNext caching docs](https://opennext.js.org/cloudflare/caching#caching)) It is not needed: with it off, the stored images were served in my test.

## Does drawing per visit fit the Free plan?

The Workers Free plan allows 10 ms of CPU time per web request. ([Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/#cpu-time)) A Worker that keeps going over is stopped with error 1102. Occasional overruns are tolerated. (same source)

I timed one share image draw in the local Worker. The icon was embedded as text, as [issue #4](https://github.com/maximsan/getbrewpath/issues/4) decided, so the draw did not fail. Twelve requests each, on an Apple M1 Pro:

- Home share image: 41 ms fastest, 43 ms median. The first draw took 245 ms.
- Card share image: 40 ms fastest, 44 ms median.
- `/robots.txt` for comparison: 5 ms median.

These are total response times on a laptop, not Cloudflare CPU time. They suggest one draw costs about four times the Free limit. Not confirmed: the CPU time on Cloudflare's own machines. A deployed Worker shows it in Workers Logs. (same source)

## Recommendation

1. Add the static-assets cache to `open-next.config.ts`.
2. Deploy with `opennextjs-cloudflare deploy`, or run `populateCache remote` before `wrangler deploy`.
3. Make the card share image's `generateStaticParams` return `locale` and `id` for every language.
4. Consider `dynamicParams = false` on both share image routes, so a missing param shows up as a 404.
5. Pin `@opennextjs/cloudflare` to at least 1.20.12, the first version with Next.js 16.4 support. ([cloudflare changelog 1.20.12](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/CHANGELOG.md#12012))
6. After the first deploy, open both share images and check Workers Logs. A served copy should show almost no CPU time.

## Open decisions for the owner

1. Whether to add `dynamicParams = false` to the share image routes.
2. Whether the deploy runs `opennextjs-cloudflare deploy`, or `wrangler deploy` with a separate `populateCache remote` step.
