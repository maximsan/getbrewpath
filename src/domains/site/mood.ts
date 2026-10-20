/** The app's two colour moods. Cupping is light, Dark Roast is dark. */
export const MOODS = ['cupping', 'dark-roast'] as const;
export type Mood = (typeof MOODS)[number];

/**
 * The mood for each of the phone's light and dark settings, as in the app
 * (brewpath ADR-0037). The mood provider names its themes after the settings.
 */
export const MOOD_OF_SCHEME = {
  light: 'cupping',
  dark: 'dark-roast',
} as const satisfies Record<string, Mood>;
export type ColorScheme = keyof typeof MOOD_OF_SCHEME;
export const COLOR_SCHEMES = Object.keys(MOOD_OF_SCHEME) as ColorScheme[];

export const MOOD_STORAGE_KEY = 'bp-site-mood';
