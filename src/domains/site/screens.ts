import { type Mood, MOODS } from './mood';

/** App screenshots in `public/images/screens/<mood>/`, as shown on the home and press pages. */
export const SCREENS = ['today', 'path', 'lesson', 'fill', 'roasty', 'complete', 'intro'] as const;
export type ScreenId = (typeof SCREENS)[number];

/** Width over height of the phone silhouette the screenshots sit in. */
export const SCREEN_ASPECT = '826 / 1750';

export const screenSrc = (screen: ScreenId, mood: Mood) => `/images/screens/${mood}/${screen}.png`;

/** A phone's image of `screen`, one per mood. */
export const screenShots = (screen: ScreenId): { src: string; mood: Mood }[] =>
  MOODS.map((mood) => ({ mood, src: screenSrc(screen, mood) }));

/** The file name a press download is saved as. */
export const screenDownloadName = (screen: ScreenId, mood: Mood) =>
  `brewpath-${screen}-${mood}.png`;
