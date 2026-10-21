/** The app's two colour moods. Cupping is light, Dark Roast is dark. */
export const MOODS = ['cupping', 'dark-roast'] as const;
export type Mood = (typeof MOODS)[number];
