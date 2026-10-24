/** The app screens the home page shows. */
export const SCREENS = ['today', 'lesson', 'fill', 'deck', 'term'] as const;
export type ScreenId = (typeof SCREENS)[number];
