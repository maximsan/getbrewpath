# Security and Coffee Card review — 30 October 2026

Local implementation for [the approved map](https://github.com/maximsan/getbrewpath/issues/58).
The reviewed website implementation is published in [PR #66](https://github.com/maximsan/getbrewpath/pull/66).
The shorter sharing-copy follow-up is also published in that PR.
A subsequent accessibility follow-up is local pending push approval. No deployment,
provider-setting change or history rewrite has been performed in this effort.
This is the consolidated handoff; the superseded planning/research drafts were removed.

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

A local accessibility follow-up reproduces and fixes two additional defects:
the skip link did not transfer focus into main content, and the long card-page
heading overflowed a narrow phone when text sizes were doubled. All 71 Chromium
browser tests, 80 unit tests, lint, type checking and the Cloudflare build pass.
The new checks cover representative short/long cards and a Module Reward in both
moods, using frozen computed font sizes doubled through a test stylesheet.
This is not a substitute for actual browser zoom or VoiceOver verification.
Telegram's in-app header behavior on iOS 27.0.1 remains unresolved; the automated
WebKit scroll/resize probe cannot verify native browser chrome.

The original PR passed its build/test, secret scan, Lighthouse and GitGuardian
checks. Additional commits require approval before pushing. Main deploys
automatically after merge. GitHub issue resolutions and security-setting changes
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
