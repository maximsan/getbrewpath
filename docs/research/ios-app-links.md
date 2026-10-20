# iOS: Smart App Banner and links to the app's own domain

Research for [#9](https://github.com/maximsan/getbrewpath/issues/9). Sources are Apple's own pages, read on 2026-10-20.

Two terms used throughout:

- A **universal link** is an ordinary web address that iOS opens in the app when the app is installed.
- The **association file** is `apple-app-site-association`. It is a JSON file on the website that lists which addresses the app may open.

## Short answer

- The Smart App Banner opens the installed app and hands it the `app-argument` address.
- Apple documents the banner for Safari only. Apple says nothing about Chrome or in-app browsers.
- The same-domain rule still holds. A link to the domain the visitor is already on stays in the browser.
- Apple's fix for that rule is a second subdomain for links that should open the app.
- Claiming `/` makes a home-page link open the app when it is tapped from another app or another site. Typing the address or clicking within the site keeps it in the browser.

## What the site and the app do today

- The app claims one domain: `applinks:brewpath.maximsan.dev`. Source: `ios/Runner/Runner.entitlements` in the app repo.
- The app has no App Store id yet. `SupportLinks.appStoreId` is `null`. Source: `lib/core/config/app_links.dart` in the app repo.
- The site's "Open in the app" link points to `https://brewpath.maximsan.dev/card/<id>`. Source: `APP_LINKS_ORIGIN` and `appCardLink` in `src/domains/site/site.ts` on `origin/feat/locales-selling-models-moods`.
- The site's association file claims two patterns: `/` and `/card/*`. Source: `src/app/.well-known/apple-app-site-association/route.ts` on the same branch.
- The site's pages have no prefix for English. The routing uses `localePrefix: 'as-needed'` with English as the only locale. Source: `src/i18n/routing.ts` on the same branch.

## 1. The Smart App Banner

The Smart App Banner is a bar at the top of a web page in Safari. A page turns it on with this meta tag:

```html
<meta name="apple-itunes-app" content="app-id=myAppStoreID, app-argument=myURL">
```

### Does it open the installed app at the `app-argument` address?

Yes, according to Apple's banner page.

- When the app is installed, tapping the banner opens the app. Source: [Promoting Apps with Smart App Banners](https://developer.apple.com/documentation/webkit/promoting-apps-with-smart-app-banners).
- When the app is missing, tapping the banner opens the App Store page. After the download, the banner's button reads Open. Source: same page.
- `app-argument` is optional and must be a valid URL. It lets the visitor "jump from your website to the corresponding position" in the app. Source: same page.
- The app receives the `app-argument` value as the URL in `application(_:open:...)`. That is the delegate method for opened URLs. It is not the method that receives universal links. Source: same page, section "Provide Navigational Context to Your App".
- Universal links arrive through a different method, `application(_:continue:restorationHandler:)`. Source: [Supporting universal links in your app](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app).

Not confirmed: that the Flutter app routes an `https` address that arrives through `application(_:open:...)`. The app sets `FlutterDeepLinkingEnabled` in `ios/Runner/Info.plist`. Apple's docs do not cover Flutter. A device test would settle it.

### Conditions Apple states for the banner

- The tag needs `app-id`, the App Store id. Source: [Promoting Apps with Smart App Banners](https://developer.apple.com/documentation/webkit/promoting-apps-with-smart-app-banners).
- The banner is hidden when the device cannot run the app or the app is unavailable in the visitor's region. Source: same page.
- The banner does not show inside a frame or in the iOS simulator. Source: same page.
- After the visitor closes the banner, it stays closed on return visits. Source: same page.
- The app must be on sale in the App Store, and the device must reach App Store servers. Source: Apple staff answer in [Disappearing empty Smart App Banner](https://developer.apple.com/forums/thread/721316).
- The banner shows only in regular browsing, never in Private Browsing. Source: same answer.

### A second banner comes from the association file

An Apple engineer describes a banner state that needs no meta tag. Safari shows an Open button when three things are true:

1. The app supports universal links.
2. The app is installed.
3. The current page's address matches a pattern in the association file.

The way to hide that banner is to leave the address out of the association file's patterns. Source: Apple engineer answer in [Smart App Banner and apple-app-site-association file relation](https://developer.apple.com/forums/thread/105129).

Apple's universal-link technote says the same in short form. After the visitor types the address directly, "your site will show a banner to open your app". Source: [TN3155: Debugging universal links](https://developer.apple.com/documentation/technotes/tn3155-debugging-universal-links).

### Does the banner work outside Safari?

Apple's docs are silent. Apple's banner page, conference talks and staff answers name Safari only. None of them mention Chrome, other browsers, or in-app browsers.

- The 2019 talk at Apple's yearly developer conference says the banner "integrates seamlessly with Safari". Source: [What's New in Universal Links, Apple developer conference 2019](https://developer.apple.com/videos/play/wwdc2019/717/).
- Apple says nothing about the banner in Chrome for iOS. Not confirmed either way.
- Apple says nothing about the banner in in-app browsers. An in-app browser is a web view inside another app, such as Instagram's. Not confirmed either way.
- Apple says nothing about the banner in `SFSafariViewController`, Apple's ready-made in-app Safari screen. Not confirmed either way.

## 2. Same-domain links on current iOS

The rule still holds. Apple's current docs state it in two places.

- In Safari, a tap on a universal link to the same domain opens the link in Safari. A tap on a link to a different domain opens the app. Source: [Allowing apps and websites to link to your content](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content).
- If a universal link "has the same domain as the previous navigation", the browser keeps the visitor in the browser. Source: [TN3155](https://developer.apple.com/documentation/technotes/tn3155-debugging-universal-links).
- Apple's fix is a different subdomain. The app claims that subdomain too, and the subdomain serves its own association file. A link to it then opens the app. Source: same technote, section "Use universal links on your site".
- Each subdomain needs its own entry in the app's claim and its own association file. Source: [Supporting associated domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains).
- Typing an address into the browser's address bar never opens the app. Source: [TN3155](https://developer.apple.com/documentation/technotes/tn3155-debugging-universal-links).
- Other browsers decide on their own whether to support universal links. Safari supports everything in the technote. Source: same technote.
- A long press on a link offers "open in app" or "open in browser". The choice becomes the device's default for that domain. Source: same technote.

For BrewPath this means:

- Today the "Open in the app" link works. It goes from `getbrewpath.com` to `brewpath.maximsan.dev`, which is a different domain.
- If the app claims `getbrewpath.com` and the link points there, a tap on a `getbrewpath.com` page stays in Safari.

Not confirmed: whether Safari compares the full host name or the registrable domain. Apple's docs say "domain" and "subdomain" without defining the comparison. TN3155's example implies the full host name, because its fix is a subdomain of the same domain.

## 3. Claiming `/`, the home page

The association-file pattern `"/": "/"` matches only the exact path `/`. It still matches any query string and any fragment.

- A `/` pattern without `*` has no wildcard. `*` matches "zero or more characters". Source: [applinks components](https://developer.apple.com/documentation/bundleresources/applinks/details-swift.dictionary/components-swift.dictionary).
- An unset `?` key or `#` key defaults to `*`, which matches everything. So `/?utm_source=x` also matches. Source: same page.
- The first matching pattern wins. Source: same page.
- An `exclude: true` pattern stops matching and keeps that address in the browser. Source: same page.

So does every home-page visit from a link open the app? For a visitor with the app installed, mostly yes.

- A tap from another app opens the app. Messages and Mail are examples. Source: [Allowing apps and websites to link to your content](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content).
- A tap from another website in Safari opens the app, because the domain changes. A search result is an example. Source: same page.
- A typed address stays in the browser. Source: [TN3155](https://developer.apple.com/documentation/technotes/tn3155-debugging-universal-links).
- A click from another page on the site stays in the browser, because the domain does not change. Source: same technote.
- A visitor who chose "open in browser" by long press stays in the browser. Source: same technote.
- In Safari, the home page also shows the Open banner from the association file. Source: Apple engineer answer in [thread 105129](https://developer.apple.com/forums/thread/105129).

Today none of this happens on `getbrewpath.com`. The app claims only `brewpath.maximsan.dev`, so iOS ignores the association file on `getbrewpath.com`. Source: `ios/Runner/Runner.entitlements` and [Supporting associated domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains).

A side finding: `/card/*` matches only unprefixed card pages. A future locale with a prefix would serve `/de/card/<id>`, which the pattern does not match. Source: `src/i18n/routing.ts` and [applinks components](https://developer.apple.com/documentation/bundleresources/applinks/details-swift.dictionary/components-swift.dictionary).

## Recommendation

Once the app claims `getbrewpath.com`, keep the "Open in the app" link on a different subdomain that the app also claims. This is Apple's documented fix for same-domain links. Today's `brewpath.maximsan.dev` already plays that role. Add the Smart App Banner as well, with `app-argument` set to the page's own address. Add it only after the app is on sale, because the banner needs an App Store id. Treat the banner as Safari-only, because Apple documents nothing else. Leave `/` out of the `getbrewpath.com` claim. With `/` claimed, links from search results, Messages or Mail send installed visitors into the app instead of the home page. Card pages gain from opening the app, and the home page does not.

## Open decisions for the owner

1. Which host carries the "Open in the app" link once the app claims `getbrewpath.com`? Options: keep `brewpath.maximsan.dev`, or add a subdomain of `getbrewpath.com`.
2. Should the `getbrewpath.com` association file keep claiming `/`, the home page?
3. Should card pages add the Smart App Banner once the App Store id exists? This depends on a device test that the app routes the `app-argument` address.
