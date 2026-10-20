import type { Mood } from '@domains/site/mood';

/**
 * Classes that show an element in one mood only. CSS decides from `data-mood`,
 * so the server render is already right.
 * A section can set its own `data-mood`. An element inside a dark section
 * shows its Dark Roast version, even on a Cupping page.
 */
export const MOOD_ONLY: Record<Mood, string> = {
  cupping: 'in-data-[mood=dark-roast]:hidden',
  'dark-roast': 'not-in-data-[mood=dark-roast]:hidden',
};
