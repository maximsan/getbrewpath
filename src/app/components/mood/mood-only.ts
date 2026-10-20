import type { Mood } from '@domains/site/mood';

/**
 * Classes that show an element in one mood only. CSS decides from `data-mood`,
 * so the server render is already right. Dark Roast wins when the page or any
 * section around the element is dark, as a section's own `data-mood` keeps it dark.
 */
export const MOOD_ONLY: Record<Mood, string> = {
  cupping: 'in-data-[mood=dark-roast]:hidden',
  'dark-roast': 'not-in-data-[mood=dark-roast]:hidden',
};
