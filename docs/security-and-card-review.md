# Security and Coffee Card review — 30 October 2026

Implementation and verification for [the approved map](https://github.com/maximsan/getbrewpath/issues/58).
[PR #66](https://github.com/maximsan/getbrewpath/pull/66) merged as
`a432bd5935bbc24c2319acd2e2534b2434115861`. Its post-merge source checks and secret
scan passed, but the browser gate failed before deployment: the enlarged-text
test's stylesheet raced with streamed DOM cleanup and browser style application.
This follow-up fixes the test setup and runs the browser gate on PRs as well as
main. Deployment remains unconfirmed until the new changes pass remotely and
are merged. No provider-setting change or history rewrite has been performed.

The mobile caption and opaque padded share-image canvas are published separately
in [PR #877](https://github.com/maximsan/brewpath/pull/877), still open at verification.
No actual iPhone-to-Telegram share or native Telegram browser verification has
been completed. This is the consolidated handoff; superseded drafts were removed.

## Delivered changes

- Full content and original illustrations for 37 Coffee Cards: 32 lesson cards and
  five Module Rewards. Text, fonts and artwork come from the same app commit,
  `1050fee3eee4be254b883352fb3181c6ba9a8e43`. Generated files are reproducible with
  `pnpm sync-cards`. Imported SVG uses a restricted drawing format, checked XML,
  escaped translated labels, resolved palette and outlined source-font glyphs.
  Pages embed it as an image rather than injecting its markup into the DOM.
- Responsive card metadata and title placement; card-specific PNG share images.
- All download destinations now use the owner's actual Apple app record.
  Card-specific universal links retain their card ID. The app-links host falls
  back to the App Store when iOS does not open the installed app.
- Home-logo modified clicks preserve normal browser behavior.
- Broader credential-file ignore rules, narrowly scoped scanner exceptions,
  checksum-pinned secret scanning and dependency auditing before deployment.
- Patched the affected transitive Undici dependency in Cloudflare tooling.
  The initial audit reported eight advisories (four high, four moderate), not
  eight demonstrated production exploits. The patched dependency audit is clean.

## Exposure decision

No access credential was confirmed in the scanned website material. The Apple
application identifier is required in the public association response; the
analytics browser site ID is intentionally present in HTML. Neither is a private
signing key or account API token. Hiding their source values in environment
variables would not hide their public output. See [Apple associated domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains)
and [Cloudflare's browser setup](https://developers.cloudflare.com/web-analytics/get-started/).

The scanner ignores only two exact historical analytics matches and one exact
callback assignment in the prototype bundle. It retains the default detection
rules. A synthetic credential was rejected without saving or printing its value.

The current PDFs have non-personal author fields: `python-docx` and `(anonymous)`.
Other metadata includes software names and timestamps, including template dates.
PDF-object inspection found no attachments, comments, forms, scripts or local
paths. The Terms opening action sets the initial page view. The PDFs and visible
legal/contact disclosures remain unchanged. Removing unnecessary metadata is
optional housekeeping, not remediation of a demonstrated credential leak.
One developer-machine path was replaced with a generic path in a test fixture.

There is no demonstrated sensitive exposure that currently justifies rewriting
Git history. If a credential is discovered later, rotate it first. A rewrite
cannot erase copies, forks, cached views or every pull-request reference; follow
[GitHub's removal procedure](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

## Review scope and limits

Baseline: website commit `08cdbb44066af4221e08542f2a04082c77231662`.

| Surface                  | Evidence and limit                                                                                                                                                                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Source                   | Inventoried 255 tracked files; boundary searches over 90 runtime text files, with manual tracing of routes, content loading, rendering, navigation, security and build configuration. Not a manual review of every file or dependency implementation.                                      |
| History                  | Supplemental patterns over 183 reachable commits / 1,015 unique blobs; Gitleaks reported 146 commits with scanned changes. All 14 remote branch heads and the base/head objects of 29 PRs were available. No tags. Deleted/dangling commits and other people's copies are not established. |
| GitHub retained material | Pattern-scanned 57 issue/PR bodies, 60 discussion endpoints and 229 log files from 104 retained Actions runs, without raw findings saved in the repository. No confirmed credential match. No retained artifacts, releases or reported forks. Deleted material cannot be accounted for.    |
| Binary assets            | Inspected six historical PDF blobs and metadata from 71 historical images. No GPS or contributor-identity metadata match in images. No complete OCR/pixel privacy review; no claim that every hidden-content technique was excluded.                                                       |
| Production               | Read-only requests to home, first card, association file and robots returned 200 with CSP, HSTS, nosniff, framing, referrer and permissions headers. This verifies the existing deployment, not unpublished code.                                                                          |
| Infrastructure           | GitHub secret scanning, push protection and security updates were disabled; main lacked branch protection at inspection. Cloudflare dashboard WAF, alerting, credential scopes and account access were not fully verified.                                                                 |

## OWASP applicability

Mapping follows the [OWASP web Top 10:2025](https://owasp.org/Top10/2025/).

| Category                   | Assessment within this website                                                                                                                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 Access control         | Product pages are public; card IDs and locales use explicit lookups. Provider/repository access controls remain an operational boundary.                                                                                               |
| A02 Misconfiguration       | Response headers checked. CSP permits inline scripts/styles for static Next.js and theme output; this reduces protection if an injection sink is introduced. No current untrusted HTML sink was found.                                 |
| A03 Supply chain           | Patched dependency advisories; lockfile, pinned Actions and scanner checksum reviewed. CI gates added. External analytics JavaScript remains a trusted third-party dependency without SRI.                                             |
| A04 Cryptography           | No application credential store or sensitive user-data persistence found. HTTPS and provider-managed secrets are external responsibilities.                                                                                            |
| A05 Injection              | React text escaping, schema-checked bundled content, fixed redirect destinations, restricted SVG import, and Git invoked without a shell. No demonstrated injection flow found.                                                        |
| A06 Insecure design        | Static public content with a local lesson demo; no custom product data API, payments or file uploads. The separate app is outside this audit.                                                                                          |
| A07 Authentication         | No product accounts or sessions in this website. GitHub/Cloudflare account security is not inferred from this absence.                                                                                                                 |
| A08 Integrity              | Course, artwork and fonts read from one resolved app commit; unsupported/malformed artwork fails import. Third-party analytics remains a trust boundary.                                                                               |
| A09 Logging/alerting       | Request logging is deliberately disabled for privacy. Provider security alerting remains unverified; logging was not silently enabled.                                                                                                 |
| A10 Exceptional conditions | Unknown card/page/image routes return 404; invalid content/art fails explicitly; tests exercise resets, disabled answers and menu cleanup. This is bounded behavior testing, not load/fault-injection testing of the hosting provider. |

The [LLM Top 10:2025](https://genai.owasp.org/llm-top-10/) is not applicable to a
reachable LLM path in this repository: no model provider, prompt processing,
retrieval/vector store, model-output rendering or tool-execution integration was
found. This does not assess AI systems in another repository or provider account.

## Verification and remaining operational work

Validation after integrating main `77e80a7`: all 80 unit tests (15 files), lint,
type checking, the Cloudflare build and all 64 Chromium browser tests pass. The
browser suite covers all cards at 320/768/1024/1440 CSS pixels in both moods, image decoding,
share-image dimensions, unknown IDs, download destinations and navigation/demo/
FAQ/mood/mascot/recovery controls. Representative phone/desktop pages and long-title
share images were inspected visually. Not every illustration was manually compared
pixel-for-pixel with the app. Content regeneration produced no diff. The final
source inventory and 18 MB of generated public assets passed the configured
secret scan; the dependency audit reported no advisories. Lighthouse passed its
thresholds over five runs per page: median home 84, privacy 95, Coffee Card 96.
Verification reproduced and resolved card metadata clipping, the modified-click
defect, and a transient resize assertion; the final suites pass. These are bounded checks.

The merged accessibility follow-up reproduces and fixes two additional defects:
the skip link did not transfer focus into main content, and the long card-page
heading overflowed a narrow phone when text sizes were doubled. All 71 Chromium
browser tests, 80 unit tests, lint, type checking and the Cloudflare build pass.
The new checks cover representative short/long cards and a Module Reward in both
moods, using frozen computed font sizes doubled through a test stylesheet.
This is not a substitute for actual browser zoom or VoiceOver verification.
Telegram's in-app header behavior on iOS 27.0.1 remains unresolved; the automated
WebKit scroll/resize probe cannot verify native browser chrome.

The original PR passed its build/test, secret scan, Lighthouse and GitGuardian
checks. The merged main run then exposed the enlarged-text test race (70 browser
tests passed, one failed); its deploy command did not run. The follow-up keeps
the size assertion mandatory, uses type-based selectors and an adopted stylesheet,
and waits for actual computed enlarged text. Its targeted repeated run passes
all 35 cases. The full follow-up browser suite passes all 75 tests; all 80 unit
tests, lint, type checking and formatting pass, and the dependency audit reports
no known advisories. The Cloudflare preview rebuild is included in that run.
Additional commits require approval before pushing. Main deploys automatically
after merge when its gates pass. GitHub issue resolutions and security-setting changes
need their own concrete approved external-write scope; the issue map tracks
remaining delivery and operational work.

At launch: verify the real App Store listing is publicly available and test
universal-link handling on an actual iPhone with/without the app. Desktop Chromium
checks destinations and redirects; it cannot prove iOS app handoff.

Provider hardening still requires a deliberate decision: enable supported GitHub
secret scanning/push protection/security updates and protect main while preserving
required deployment access. Confirm Cloudflare security controls and alerts without
collecting traffic data contrary to the privacy notice. No provider changes were made.

Passing scans and tests is not proof of absence of vulnerabilities. Recheck
advisories and external settings at publication time.

## Card-by-card implementation inventory

All rows below have bundled title, summary, fact and available metadata; an
original illustration in both palettes; a generated page and 1200 × 630 PNG share
image. The browser test iterates every row at 320, 768, 1024 and 1440 CSS pixels
in both moods, checks image decoding, text fit, card-specific app links, the real
App Store URL, and title/summary sharing metadata. These are automated checks,
not a claim of manual pixel comparison of all illustrations with the app.

The authoritative content/art/font source remains app commit
`1050fee3eee4be254b883352fb3181c6ba9a8e43`; existing card IDs are deliberately
preserved, including historical nonsequential lesson suffixes.

| Card route     | Title                  | Module     | Kind                | Source        |
| -------------- | ---------------------- | ---------- | ------------------- | ------------- |
| `/card/c1`     | The Coffee Cherry      | Beans      | `botanical`         | Lesson        |
| `/card/c2`     | The Bean Belt          | Beans      | `map`               | Lesson        |
| `/card/c3`     | Arabica                | Beans      | `specimen`          | Lesson        |
| `/card/cM1`    | Beans Field Guide      | Beans      | `fieldGuideBeans`   | Module Reward |
| `/card/c-m2l1` | The Drying Bed         | Processing | `dryingbed`         | Lesson        |
| `/card/c-m2l2` | Fermentation           | Processing | `ferment`           | Lesson        |
| `/card/c-m2l3` | The Coffee Label       | Processing | `label`             | Lesson        |
| `/card/c-m3l1` | The Roast Spectrum     | Roasting   | `roastscale`        | Lesson        |
| `/card/c-m3l2` | First and Second Crack | Roasting   | `crack`             | Lesson        |
| `/card/c-m3l3` | The Roast Date         | Roasting   | `calendar`          | Lesson        |
| `/card/c-m4l1` | Particle Size          | Grind      | `particles`         | Lesson        |
| `/card/c-m4l2` | Burr vs Blade          | Grind      | `burrblade`         | Lesson        |
| `/card/c-m4l3` | The Grinder            | Grind      | `grinddial`         | Lesson        |
| `/card/c-m5l1` | The Brew Ratio         | Brew       | `gauge`             | Lesson        |
| `/card/c-m5l2` | Water                  | Brew       | `droplet`           | Lesson        |
| `/card/c-m5l3` | Sour vs Bitter         | Brew       | `spectrum`          | Lesson        |
| `/card/cM2`    | Processing Field Guide | Processing | `fieldGuideProcess` | Module Reward |
| `/card/cM3`    | Roasting Field Guide   | Roasting   | `fieldGuideRoast`   | Module Reward |
| `/card/cM4`    | Grind Field Guide      | Grind      | `fieldGuideGrind`   | Module Reward |
| `/card/cM5`    | Brew Field Guide       | Brew       | `fieldGuideBrew`    | Module Reward |
| `/card/c-m1l4` | Altitude               | Beans      | `altitude`          | Lesson        |
| `/card/c-m1l5` | The Trade              | Beans      | `scales`            | Lesson        |
| `/card/c-m1l7` | The Cherry in Section  | Beans      | `layers`            | Lesson        |
| `/card/c-m1l6` | Varieties              | Beans      | `varieties`         | Lesson        |
| `/card/c-m2l4` | Drying                 | Processing | `drying`            | Lesson        |
| `/card/c-m2l5` | Anaerobic Fermentation | Processing | `anaerobic`         | Lesson        |
| `/card/c-m2l6` | Decaf                  | Processing | `decaf`             | Lesson        |
| `/card/c-m3l4` | The Roast              | Roasting   | `roastcurve`        | Lesson        |
| `/card/c-m3l5` | Light vs Dark          | Roasting   | `lightdark`         | Lesson        |
| `/card/c-m3l6` | Caffeine               | Roasting   | `caffeine`          | Lesson        |
| `/card/c-m4l5` | Grind and Brewer       | Grind      | `grindbrewer`       | Lesson        |
| `/card/c-m4l6` | Freshness              | Grind      | `hourglass`         | Lesson        |
| `/card/c-m4l7` | Your Grinder           | Grind      | `burrs`             | Lesson        |
| `/card/c-m5l4` | Extraction             | Brew       | `extraction`        | Lesson        |
| `/card/c-m5l5` | The Filter             | Brew       | `filter`            | Lesson        |
| `/card/c-m5l7` | The Shot               | Brew       | `shot`              | Lesson        |
| `/card/c-m5l6` | Your First Cup         | Brew       | `firstcup`          | Lesson        |

## Interactive-control inventory

Scope: rendered English home, card, legal and not-found pages at the reviewed
revision. The source search covers buttons, anchors, Link/LinkButton instances
and click handlers. The site publishes only English, so the language-links
component renders no switch to exercise. Repeated controls are grouped by their
shared behavior; each card-specific destination is checked for all 37 cards.

| Control                                                              | Expected result and verification                                                                                                 |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Brand/home links                                                     | Home, top-of-home scroll and browser modified-click behavior; browser tests.                                                     |
| Desktop section links, hero lesson link                              | Correct home fragment and visible destination; browser tests over all section links.                                             |
| Phone menu toggle, Escape, menu sections                             | Open/close, focus restoration, background inertness, close on resize/navigation, normal and reduced motion; browser tests.       |
| Phone menu legal links                                               | Correct document, closed menu and restored background; browser tests over all legal pages.                                       |
| Light / Dark                                                         | Set the selected mood and persist it across reload; browser tests.                                                               |
| Hero, header, menu, pricing, final, demo and recovery download links | Owner's actual Apple app URL; rendered href assertions. Public listing availability is separate.                                 |
| Card download / open / home links                                    | Real Apple URL, same-card universal link and home route; every card's hrefs checked. iOS handoff still needs a device.           |
| Lesson answer choices, Continue, restart, Try again                  | Selection/feedback, locked answered state, disabled Continue before answering, perfect/partial grading and reset; browser tests. |
| FAQ disclosures                                                      | Open, close and replace previous answer; every FAQ exercised.                                                                    |
| Roasty moment choices / random play                                  | Selected caption and different playable moment; every listed moment exercised.                                                   |
| Not-found wake / recovery                                            | Wake animation, return to sleep and home recovery; browser tests.                                                                |
| Skip navigation                                                      | Keyboard focus moves into main and then its first action; representative cards exercised.                                        |
| Footer legal links and website-to-app privacy link                   | Correct document; footer browser navigation/content assertions and manual inspection of the policy link destination.             |
| Legal contents links                                                 | Each anchor reaches its own section; all three legal outlines exercised.                                                         |
| Legal PDF downloads                                                  | Download attribute, correct path, HTTP 200, PDF content type and file signature; both PDFs checked.                              |
| Support/contact links                                                | Expected mailto destination in page/menu/footer assertions; no email was sent or native mail application tested.                 |

## Remaining release gates

- Complete exposure classification and reproducible private inventory in the
  concurrent exposure investigation. Earlier broad scan counts above do not
  establish a complete author/message or generated-server-output review.
- The GitHub settings refresh on 30 October still reports secret scanning,
  push protection and Dependabot security updates disabled, no main protection,
  and no repository rulesets. Any provider configuration change requires an
  approved concrete change; Cloudflare account controls remain unverified.
- Publish and merge this browser-gate follow-up, then confirm the main run
  deploys successfully and inspect live metadata and app-host redirects.
- Merge/release the mobile sharing fix after its normal review; verify a new
  share from that build in Telegram, including padded corners and concise text.
- Reproduce and fix the reported header issue in Telegram's in-app browser on
  the affected iOS version. Standalone Safari was reported working; the
  automated WebKit probe does not exercise Telegram's native browser chrome.
- The read-only App Store request on 30 October returned HTTP 404 for the real
  app record. Confirm public launch availability before treating download as an
  end-to-end working action. Do not replace the owner-supplied ID with a stub.
- Verify installed/uninstalled universal-link handoff on an actual iPhone,
  actual browser text zoom and VoiceOver; reconcile tracker resolutions only
  to the evidence delivered. These gates are open, not silently accepted risks.

The consolidated report is intended to stay in the repository. No temporary
planning document needs to be retained or manually removed by the owner.
