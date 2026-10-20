# How are images resized on Cloudflare?

Research for [issue #7](https://github.com/maximsan/getbrewpath/issues/7), part of [issue #3](https://github.com/maximsan/getbrewpath/issues/3).

**Answer.** The site needs at most 150 distinct resized images a month. Cloudflare's free allowance is 5,000. So resizing through Cloudflare Images costs nothing for this site. Serving the pictures unresized would make the home page about 19 times heavier: about 2.8 megabytes (MB) instead of about 0.15 MB.

## Terms

- **Transformation**: one resized copy of one picture, such as `today.png` at 640 pixels wide.
- **Unique transformation**: Cloudflare's billing unit. One source picture with one set of resize settings counts once per calendar month, however often it is requested.
- **Images binding**: the connection that lets the site's server code call Cloudflare Images directly. It is declared in the Cloudflare config file as `IMAGES`.
- **OpenNext**: the adapter that runs a Next.js site on Cloudflare Workers, Cloudflare's server platform.
- **`/_next/image`**: the address `next/image` asks for a resized copy of a picture.
- **`unoptimized`**: a Next.js setting that serves each picture's original file, with no resizing.
- **srcset**: the list of picture widths in an `<img>` tag. The browser downloads one width from the list.
- **Device pixel ratio (DPR)**: how many screen pixels a phone or laptop uses per CSS pixel. Most phones are 2 or 3.
- **Megabyte (MB)**: one million bytes. B means bytes.
- **PNG, Joint Photographic Experts Group (JPEG), WebP, AV1 Image File Format (AVIF)**: picture file formats. WebP and AVIF are newer and smaller.

## How the resizing works on Cloudflare

OpenNext answers `/_next/image` with its own handler. The handler calls the Images binding for PNG, JPEG, WebP and AVIF pictures. It asks for the requested width with `fit: "scale-down"`, so a picture is never made larger than its original. Sources:
[images.ts in opennextjs-cloudflare](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/src/cli/templates/images.ts),
[OpenNext image guide](https://opennext.js.org/cloudflare/howtos/image).

- To turn resizing on, the site must declare the `IMAGES` binding or use a custom loader. Source: [OpenNext image guide](https://opennext.js.org/cloudflare/howtos/image).
- Without the binding, the handler logs a warning and serves the original file. Source: [images.ts](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/src/cli/templates/images.ts), the `env.IMAGES === undefined` branch.
- The handler only accepts widths from the Next.js width lists. Source: [images.ts](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/src/cli/templates/images.ts), `validateWidthQueryParameter`.
- Pictures from `public/` get a one-year `immutable` cache header, so a browser downloads each resized copy once. Source: [images.ts](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/src/cli/templates/images.ts), `createImageResponse`.
- Cloudflare does not cache the binding's output on its servers by itself. Each request that misses the browser cache runs the resize again. Source: [Images binding docs](https://developers.cloudflare.com/images/transform-images/bindings/).

## What Cloudflare Images costs

- Every account starts on the Images Free plan. Source: [Images pricing](https://developers.cloudflare.com/images/pricing/).
- The Free plan allows 5,000 unique transformations each calendar month. Source: [Images pricing](https://developers.cloudflare.com/images/pricing/).
- One source picture with one set of settings counts once per month, however many requests it gets. Source: [Images pricing](https://developers.cloudflare.com/images/pricing/).
- Output format and quality do not make a transformation unique. Only the source and the other settings do, here the width. Source: [Images pricing](https://developers.cloudflare.com/images/pricing/).
- Calls through the Images binding are billed as unique transformations. Source: [Images binding docs](https://developers.cloudflare.com/images/transform-images/bindings/).
- Past 5,000 on the Free plan, there is no charge. Copies already in cache keep being served. New transformations return error `9422`. Source: [Images pricing](https://developers.cloudflare.com/images/pricing/).
- On the Images Paid plan, the first 5,000 are included. Each further 1,000 costs $0.50 a month. Source: [Images pricing](https://developers.cloudflare.com/images/pricing/).

Not confirmed:

- What the OpenNext handler shows the visitor after a `9422` error. The handler has no special case for it in [images.ts](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/src/cli/templates/images.ts). My guess: the picture fails to load.
- How Cloudflare tells two binding inputs apart. The handler passes the picture as a data stream, and the docs only say "source image". Source: [Images binding docs](https://developers.cloudflare.com/images/transform-images/bindings/).
- Whether the binding works on a Workers Free account. Neither the pricing page nor the binding docs say. The issue reports that it worked in the local trial build.

## Measurements in the repo

### Pictures in `public/images`

Measured with `ls -l` and `sips` on `origin/main` at commit `a1d15b5`.

| Picture | Size on disk | Pixels |
| --- | --- | --- |
| `app-icon.png` | 1,443,289 B | 1024 × 1024 |
| `seed-poster.jpg` | 22,164 B | 1280 × 720 |
| `screens/today.png` | 462,337 B | 826 × 1762 |
| `screens/paywall.png` | 641,305 B | 838 × 1752 |
| `screens/intro.png` | 291,711 B | 842 × 1760 |
| `screens/path.png` | 222,281 B | 852 × 1760 |
| `screens/lesson.png` | 189,981 B | 834 × 1756 |
| `screens/complete.png` | 183,896 B | 826 × 1748 |
| `screens/roasty.png` | 159,089 B | 838 × 1754 |
| `screens/fill.png` | 141,202 B | 842 × 1752 |

### Every `next/image` use in `src/`

| Where | Picture | Sizing |
| --- | --- | --- |
| `src/app/components/site-header/site-header.tsx` | `app-icon.png` | `width={30}`, every page |
| `src/app/components/site-footer/site-footer.tsx` | `app-icon.png` | `width={28}`, every page |
| `src/app/components/home/hero.tsx` | `today`, `lesson` | `sizes="270px"`, `sizes="240px"` |
| `src/app/components/home/how-it-works.tsx` | `lesson`, `fill`, `complete` | `sizes="250px"` |
| `src/app/components/home/features.tsx` | `path`, `today`, `roasty` | `sizes="200px"` |
| `src/app/components/home/welcome-phone.tsx` | `seed-poster.jpg` | `sizes="190px"` |
| `src/app/press/page.tsx` | all 8 screens | `sizes="200px"` |

The screens go through `PhoneShot` in `src/app/components/phone-shot/phone-shot.tsx`. The Open Graph picture in `src/app/components/og/og-image.tsx` reads `app-icon.png` from disk, so it needs no resizing.

### Distinct transformations the site can need

The site sets no `images` options in `next.config.ts`, so the Next.js defaults apply. Source: [Next.js Image docs](https://nextjs.org/docs/app/api-reference/components/image).

- Device widths: 640, 750, 828, 1080, 1200, 1920, 2048, 3840.
- Image widths: 32, 48, 64, 96, 128, 256, 384.
- Qualities: 75 only.
- Formats: WebP only.

How Next.js 16.4.2 picks the widths, from `getWidths` in `next/dist/shared/lib/get-img-props.js`:

- A `sizes` value with no `vw` unit puts all 15 widths in the srcset. Every `sizes` in this site is in pixels.
- A fixed `width` gives two entries: the width and double it, each rounded up to a listed width. The header and footer icons both become 32 and 64.

| Pictures | Widths | Transformations |
| --- | --- | --- |
| 8 screens and the seed poster | 15 | 135 |
| App icon | 2 | 2 |
| **Total the pages can request** | | **137** |
| **Upper bound if someone requests every allowed width for all 10 pictures** | | **150** |

150 is 3% of the free 5,000. Language versions share the same picture addresses, so they add nothing. Each new or replaced picture adds up to 15 more.

### Extra page weight without resizing

To estimate resized sizes, I resized each picture with `sharp` to WebP at quality 75. `sharp` is the library Next.js uses for its own resizing. Cloudflare's encoder may give somewhat different sizes; that is not confirmed.

The table assumes a phone with DPR 2. It assumes the browser takes the smallest width at least twice the display width. Browsers may choose differently; that is not confirmed.

| Page | Unresized (`unoptimized`) | Resized | Extra without resizing |
| --- | --- | --- | --- |
| Home | 2,824,239 B (2.8 MB) | 149,090 B (0.15 MB) | +2.68 MB, about 19 times heavier |
| Press | 3,735,091 B (3.7 MB) | 198,378 B (0.20 MB) | +3.54 MB |
| Any other page (header and footer icon) | 1,443,289 B (1.4 MB) | 1,246 B | +1.44 MB |

Resized sizes used, in bytes:

| Picture | 64 px | 384 px | 640 px |
| --- | --- | --- | --- |
| `app-icon.png` | 1,246 | | |
| `seed-poster.jpg` | | 1,914 | |
| `today` | | | 31,562 |
| `path` | | | 32,086 |
| `lesson` | | | 26,368 |
| `paywall` | | | 32,046 |
| `intro` | | | 19,156 |
| `fill` | | | 19,934 |
| `complete` | | | 18,104 |
| `roasty` | | | 17,876 |

Half of the extra weight is the app icon. It is a 1.4 MB file shown at 30 pixels on every page.

## The alternatives

1. **Keep the Images binding.** This is what the site does now. It costs nothing at this size. It depends on Cloudflare Images staying on for the account.
2. **Set `images.unoptimized: true`.** The original file is served "as-is", with no change to quality, size or format. Source: [Next.js Image docs](https://nextjs.org/docs/app/api-reference/components/image#unoptimized). Pages grow by the amounts in the table above.
3. **Resize at build time.** A build script would write each picture at the widths the pages use. A custom loader, set with `images.loaderFile`, would point `next/image` at those files. Source: [Next.js Image docs](https://nextjs.org/docs/app/api-reference/components/image#loaderfile). This adds a script and a loader to maintain. It also adds the resized files to the deployed site.

A smaller version of option 3: save the icon at 64 pixels and the screens at 640 pixels wide in `public/images`, then use `unoptimized`. That would bring pages close to the resized sizes for DPR 2. DPR 3 phones would get slightly blurrier screens.

## Recommendation

Keep resizing through the Cloudflare Images binding, as the site does now. The site can need at most 150 unique transformations a month. That is 3% of the 5,000 the Free plan allows, and the Free plan never charges. If the site ever passed the allowance, already-made copies would keep loading, and only new ones would fail. Serving pictures unresized would add about 2.7 MB to the home page, and 1.4 MB to every other page, mostly because of the app icon. Before launch, check in the Cloudflare dashboard that Images is enabled for the account. The docs do not say whether the binding needs a paid Workers plan.

## Open decisions for the owner

1. Which resizing approach to use: the Cloudflare Images binding (recommended), `unoptimized`, or resizing at build time.
2. Whether to shrink `app-icon.png` in the repo anyway. It is 1.4 MB at 1024 × 1024 pixels. With resizing on, visitors never download it in full, so this is optional.
