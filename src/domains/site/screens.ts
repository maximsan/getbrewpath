import type { StaticImageData } from 'next/image';

import cuppingDeck from '@assets/screens/cupping/deck.png';
import cuppingFill from '@assets/screens/cupping/fill.png';
import cuppingLesson from '@assets/screens/cupping/lesson.png';
import cuppingTerm from '@assets/screens/cupping/term.png';
import cuppingToday from '@assets/screens/cupping/today.png';
import darkRoastDeck from '@assets/screens/dark-roast/deck.png';
import darkRoastFill from '@assets/screens/dark-roast/fill.png';
import darkRoastLesson from '@assets/screens/dark-roast/lesson.png';
import darkRoastTerm from '@assets/screens/dark-roast/term.png';
import darkRoastToday from '@assets/screens/dark-roast/today.png';

import { type Mood, MOODS } from './mood';

export const SCREENS = ['today', 'lesson', 'fill', 'deck', 'term'] as const;
export type ScreenId = (typeof SCREENS)[number];

/** Width over height of the phone silhouette the screenshots sit in. */
export const SCREEN_ASPECT = '826 / 1750';

/**
 * App screenshots, as shown on the home page, one set per mood. Imported rather than
 * served from `public/`, so each gets a content-hashed address that browsers keep for good.
 */
const SCREEN_SHOTS: Record<Mood, Record<ScreenId, StaticImageData>> = {
  cupping: {
    today: cuppingToday,
    lesson: cuppingLesson,
    fill: cuppingFill,
    deck: cuppingDeck,
    term: cuppingTerm,
  },
  'dark-roast': {
    today: darkRoastToday,
    lesson: darkRoastLesson,
    fill: darkRoastFill,
    deck: darkRoastDeck,
    term: darkRoastTerm,
  },
};

/** A phone's image of `screen`, one per mood. */
export const screenShots = (screen: ScreenId): { src: StaticImageData; mood: Mood }[] =>
  MOODS.map((mood) => ({ mood, src: SCREEN_SHOTS[mood][screen] }));
