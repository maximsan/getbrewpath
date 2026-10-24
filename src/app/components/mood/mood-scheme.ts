import { BRAND_COLORS } from '@domains/site/brand';

/**
 * The phone's light and dark settings. next-themes, the library that stores the
 * visitor's pick, names its choices after them. Light shows Cupping and dark shows
 * Dark Roast, as in the app (brewpath ADR-0037).
 */
export const COLOR_SCHEMES = ['light', 'dark'] as const;
export type ColorScheme = (typeof COLOR_SCHEMES)[number];

/** The browser bar colour for each setting: the mood's page colour. */
export const BAR_COLOR_OF_SCHEME: Record<ColorScheme, string> = {
  light: BRAND_COLORS.paper,
  dark: BRAND_COLORS.darkRoast,
};

export const MOOD_STORAGE_KEY = 'bp-site-mood';
