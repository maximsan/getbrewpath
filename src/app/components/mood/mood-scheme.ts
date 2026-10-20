import { BRAND_COLORS } from '@domains/site/brand';
import type { Mood } from '@domains/site/mood';

/**
 * The mood for each of the phone's light and dark settings, as in the app
 * (brewpath ADR-0037). next-themes, the library that stores the visitor's
 * pick, names its choices after the two settings.
 */
export const MOOD_OF_SCHEME = {
  light: 'cupping',
  dark: 'dark-roast',
} as const satisfies Record<string, Mood>;
export type ColorScheme = keyof typeof MOOD_OF_SCHEME;
export const COLOR_SCHEMES = Object.keys(MOOD_OF_SCHEME) as ColorScheme[];

/** The browser bar colour for each setting: the mood's page colour. */
export const BAR_COLOR_OF_SCHEME: Record<ColorScheme, string> = {
  light: BRAND_COLORS.paper,
  dark: BRAND_COLORS.darkRoast,
};

export const MOOD_STORAGE_KEY = 'bp-site-mood';
