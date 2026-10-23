import type { Mood } from './mood';

/** App screenshots in `public/images/screens/<mood>/`, as shown on the home page. */
export const SCREENS = ['today', 'lesson', 'fill', 'deck', 'term', 'game'] as const;
export type ScreenId = (typeof SCREENS)[number];

/** Width over height of the phone frame. The screen inside it matches the screenshots' 786 × 1704. */
export const PHONE_ASPECT = '1000 / 2093';

export const screenSrc = (screen: ScreenId, mood: Mood) => `/images/screens/${mood}/${screen}.png`;
