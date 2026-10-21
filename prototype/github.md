repo: maximsan/brewpath
branch: main

## Last sync
date: 2026-10-19T17:34:58Z

### Updated in this project
- Rebuilt the Features "mood" card phone as a live Welcome screen (follows the mood switch) from `welcome_screen.dart` layout and tokens.
- Copied the seed-to-tree film poster to `assets/video/Flowerpot_seed_to_poster.jpg`.

## Screen map
| Screen | Repo files |
|---|---|
| Landing · modules strip, pricing, FAQ | assets/content/generated/modules.json, docs/payments.md, README.md |
| Landing · hero C card fan | assets/card_art/*.svg, assets/card_art/index.json, assets/content/generated/collectibles.json |
| Landing · Features mood card (live Welcome phone) | lib/features/onboarding/presentation/welcome/welcome_screen.dart, seed_video_hero.dart, sound_toggle.dart, lib/features/onboarding/presentation/intro_page.dart, lib/core/widgets/tap_cue.dart, lib/shared/theme/off_token.dart, assets/video/Flowerpot_seed_to_poster.jpg |
| Shared card page (`#/card/:id`) | docs/universal-links-setup.md, assets/content/generated/collectibles.json |
| Privacy Policy | docs/payments.md (RevenueCat, Crashlytics data flows) |

## Sync history
- 2026-10-14T21:54:00Z: initial site build from modules, collectibles, payments and universal-links docs.
