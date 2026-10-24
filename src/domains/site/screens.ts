import type { Mood } from './mood';

/** App screenshots in `public/images/screens/<mood>/`, as shown on the home page. */
export const SCREENS = ['today', 'lesson', 'fill', 'deck', 'term', 'game'] as const;
export type ScreenId = (typeof SCREENS)[number];

export const screenSrc = (screen: ScreenId, mood: Mood) => `/images/screens/${mood}/${screen}.png`;
