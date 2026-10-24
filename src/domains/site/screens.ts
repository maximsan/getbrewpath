/** The app screens the home page shows. */
export const SCREENS = ['today', 'lesson', 'fill', 'deck', 'term'] as const;
export type ScreenId = (typeof SCREENS)[number];

/** Width over height of the phone silhouette the screenshots sit in. */
export const SCREEN_ASPECT = '826 / 1750';
