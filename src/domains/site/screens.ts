/** App screenshots in `public/images/screens`, as shown on the home and press pages. */
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

/** Width over height of the phone silhouette the screenshots sit in. */
export const SCREEN_ASPECT = '826 / 1750';

export const screenSrc = (screen: ScreenId) => `/images/screens/${screen}.png`;

/** The file name a press download is saved as. */
export const screenDownloadName = (screen: ScreenId) => `brewpath-${screen}.png`;
