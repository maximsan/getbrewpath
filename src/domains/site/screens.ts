import { type Mood, MOODS } from './mood';

/** App screenshots in `public/images/screens/<mood>/`, as shown on the home and press pages. */
export const SCREENS = [
  'today',
  'path',
  'lesson',
  'fill',
  'roasty',
  'complete',
  'paywall',
  'intro',
] as const;
export type ScreenId = (typeof SCREENS)[number];

/**
 * The moods whose folder holds every screenshot. A mood left out shows
 * another mood's screenshots. Add `'cupping'` once `cupping/` has them all;
 * `screens.test.ts` checks each listed folder is complete.
 */
export const SCREENSHOT_MOODS: readonly Mood[] = ['dark-roast'];

/** Width over height of the phone silhouette the screenshots sit in. */
export const SCREEN_ASPECT = '826 / 1750';

/** The folder `mood` reads its screenshots from: its own, or the first complete one. */
const shotMood = (mood: Mood): Mood =>
  SCREENSHOT_MOODS.includes(mood) ? mood : (SCREENSHOT_MOODS[0] ?? mood);

export const screenSrc = (screen: ScreenId, mood: Mood) =>
  `/images/screens/${shotMood(mood)}/${screen}.png`;

/** A phone's image of `screen`: one per mood, or a single shared one while only one folder is complete. */
export function screenShots(screen: ScreenId): { src: string; mood?: Mood }[] {
  const perMood = MOODS.map((mood) => ({ mood, src: screenSrc(screen, mood) }));
  const shared = new Set(perMood.map((shot) => shot.src)).size === 1;
  return shared ? [{ src: screenSrc(screen, MOODS[0]) }] : perMood;
}

/** The file name a press download is saved as. */
export const screenDownloadName = (screen: ScreenId, mood?: Mood) =>
  mood ? `brewpath-${screen}-${mood}.png` : `brewpath-${screen}.png`;
