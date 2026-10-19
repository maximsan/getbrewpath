/** The app's two colour moods. Cupping is light, dark roast is dark. */
export const MOODS = ['cupping', 'dark-roast'] as const;
export type Mood = (typeof MOODS)[number];

export const DEFAULT_MOOD: Mood = 'cupping';
export const MOOD_STORAGE_KEY = 'bp-site-mood';
