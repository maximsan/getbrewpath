# BrewPath: how to build with this design system

BrewPath is a mobile app for learning about coffee. This design system ships its colour and type tokens, a class vocabulary, fonts, icons and a set of React components taken from the app's prototype. Build screens from these components first. Use the classes and `var(--*)` tokens for your own layout.

## Setup

- Load `styles.css`. It imports the tokens, the class stylesheet and the three Google Fonts.
- Components are on `window.BrewPath`, for example `const { NavRow, Sheet } = window.BrewPath;`. No provider is needed.
- Design for a phone: 393 × 852, content padding 24px (20px in tight layouts).
- Build each screen inside a frame with `position: relative; overflow: hidden; width: 393px`. Sheets, top bars and the tab bar are absolutely positioned against it. Without the clip, a closed sheet shows at the bottom.
- The light mood is the default. For the dark mood, put `data-mood="dark-roast"` on `<html>`. A mood set on an inner element also needs `color: var(--ink)` there.
- Components hold their own state, such as an answered lesson card. Pass data and callbacks only.
- Content under a `SubScreenHeader` starts `window.HEADER_PAD` pixels down, so the bar does not cover it.

## Components

The component index further down this README lists every component by group. Each one's usage note and props are in its folder, listed under *Where the details live*.

## Tokens

- **Surfaces:** `--bg` page, `--surface` raised cards and rows, `--surface-2` recessed fills.
- **Text and lines:** `--ink` primary, `--ink-mute` secondary, `--rule` 1px hairlines.
- **Brand:** `--accent` is the one brand colour; `--accent-ink` is text on an accent fill.
- **Meaning:** `--sage` success, `--berry` wrong or destructive, `--warn` celebration only, `--water` water drawn as an object.
- **Overlays:** `--dim-modal` behind a sheet, `--scrim` with `--scrim-ink` on media, `--veil` and `--veil-strong` over content still meant to be seen.
- **Illustration:** `--art-*` colours are literal coffee and the same in both moods. Never use them for UI meaning.
- **Type scale:** `--t-hero` (the celebration numeral), `--t-display`, `--t-title`, `--t-subtitle`, `--t-heading`, `--t-lead`, `--t-body`, `--t-support`, `--t-label`, `--t-micro`. Use nothing off this ladder. The Type card shows each size.
- **Radius:** `--r` for buttons, cards, sheets and media; 999px for pills and dots.

## Classes for your own layout

| Family | Classes |
|---|---|
| Type | `.ff-display` (Fraunces, titles), `.ff-ui` (IBM Plex Sans, body and controls), `.ff-mono` (IBM Plex Mono, numbers and data), `.smallcaps`, `.smallcaps-mono` (uppercase labels) |
| Buttons | `.btn` plus `.btn-primary`, `.btn-ghost` or `.btn-link` |
| Containers | `.card`, `.pick-card` (`.selected`, `.pc-title`, `.pc-desc`) |
| Layout | `.stack`, `.gap-12`, `.px-24` |

## Rules

- A number or label is mono, a control or sentence is Plex Sans, a title is Fraunces at weight 400.
- Hairlines separate things. Shadows are for sheets and floating buttons only.
- Motion is triggered by a tap, never by hover. Celebrations use coffee shapes such as beans, steam and drops, never confetti or stars.

## Where the details live

- `components/<group>/<Name>/<Name>.prompt.md`: how to use each component, with an example. `<Name>.d.ts` lists its props.
- `guidelines/colour-and-type.md`: every colour token with its role and both mood values, and the type rules.
- `guidelines/icons.md`: the icon catalogue as inline SVG. Icons use `currentColor`, so set their colour with `color`.

## Example

```jsx
const { SubScreenHeader, PageTitle, NavRow } = window.BrewPath;

<div style={{ position: 'relative', overflow: 'hidden', width: 393, height: 852, background: 'var(--bg)' }}>
  <SubScreenHeader title="Settings" onBack={goBack} />
  <div style={{ paddingTop: window.HEADER_PAD }}>
    <div className="px-24"><PageTitle>Settings</PageTitle></div>
    <div className="px-24" style={{ paddingTop: 26 }}>
      <div className="smallcaps">Practice</div>
      <NavRow label="Notifications" toggle toggleOn={on} onToggle={setOn} />
      <NavRow label="Daily reminder" value="8:00 AM" onClick={openTime} />
    </div>
  </div>
</div>
```

# BrewPath (brewpath@1.0.0)

This design system is the published brewpath React library, bundled as a single
browser global. All 30 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.BrewPath`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).
- `guidelines/` — the design system's own usage guidance (2 doc(s), see `guidelines/index.md`). Read these before composing larger layouts.

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.BrewPath.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { AnswerFeedback } = window.BrewPath;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<AnswerFeedback />);
```

## Tokens

46 CSS custom properties from brewpath. Names are
preserved verbatim from upstream. See `tokens/` for the full list.

- **color** (2): `--surface`, `--surface-2`
- **other** (44): `--bg`, `--ink`, `--ink-mute`, …

## Components

### lesson-cards
- `AnswerFeedback`
- `CardTakeaway`
- `MCQCard`
- `TrueFalseCard`
- `VisualGuideCard`

### progress-and-rewards
- `CollectionCard`
- `PointsTally`
- `RewardCard`
- `WeekStrip`

### sheets
- `ConfirmSheet`
- `Sheet`

### controls
- `DictSearchBar`
- `Disclosure`
- `FavButton`
- `QuickChip`
- `SettingsToggle`
- `SpeakButton`
- `TextField`

### rows
- `DictTermRow`
- `FormRow`
- `NavRow`
- `ReplayRow`
- `SavedRow`

### brand-and-status
- `LockBadge`
- `Roasty`

### navigation
- `PageTitle`
- `ProgressTopbar`
- `ScreenFooter`
- `SubScreenHeader`
- `TabBar`
