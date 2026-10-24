import Image, { type StaticImageData } from 'next/image';
import type { CSSProperties } from 'react';

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
import { MOOD_ONLY } from '@components/mood/mood-only';
import { type Mood, MOODS } from '@domains/site/mood';
import { SCREEN_ASPECT, type ScreenId } from '@domains/site/screens';
import { cn } from '@shared/styles/cn';

/**
 * App screenshots, one set per mood. They are imported rather than served from
 * `public/`, so each gets a content-hashed address that browsers cache for a year.
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
const screenShots = (screen: ScreenId): { src: StaticImageData; mood: Mood }[] =>
  MOODS.map((mood) => ({ mood, src: SCREEN_SHOTS[mood][screen] }));

interface PhoneShotProps {
  screen: ScreenId;
  alt: string;
  /** Rendered width hint for the image optimiser, e.g. "270px". */
  sizes: string;
  className?: string;
  style?: CSSProperties;
  /** Shown on the first screen: loads ahead of other images. */
  aboveFold?: boolean;
  /** Rises into place when its revealed card scrolls in; the value is how far it sits below the card's edge. */
  riseOffset?: string;
}

/** An app screenshot in a rounded phone silhouette, in the page's mood. */
export function PhoneShot({
  screen,
  alt,
  sizes,
  className,
  style,
  aboveFold,
  riseOffset,
}: PhoneShotProps) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-[10.5%/5%] bg-phone-frame', className)}
      style={{
        aspectRatio: SCREEN_ASPECT,
        ...(riseOffset ? ({ '--y': riseOffset } as CSSProperties) : null),
        ...style,
      }}
      data-rise={riseOffset ? '' : undefined}
    >
      {screenShots(screen).map((shot) => (
        // The screenshots carry a thin device edge; scaling past it hides the edge inside the frame.
        <Image
          key={shot.mood}
          src={shot.src}
          alt={alt}
          fill
          sizes={sizes}
          // Eager loads the hidden mood's copy too, about 15 KB per phone. Lazy loading skips
          // it, but delays the largest paint: Lighthouse scored the home page 77, not 87.
          loading={aboveFold ? 'eager' : undefined}
          fetchPriority={aboveFold ? 'high' : undefined}
          className={cn('scale-[1.06] object-cover', MOOD_ONLY[shot.mood])}
        />
      ))}
    </div>
  );
}
