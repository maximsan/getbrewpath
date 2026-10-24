import Image, { type StaticImageData } from 'next/image';

import cuppingDeck from '@assets/screens/cupping/deck.png';
import cuppingFill from '@assets/screens/cupping/fill.png';
import cuppingGame from '@assets/screens/cupping/game.png';
import cuppingLesson from '@assets/screens/cupping/lesson.png';
import cuppingTerm from '@assets/screens/cupping/term.png';
import cuppingToday from '@assets/screens/cupping/today.png';
import darkRoastDeck from '@assets/screens/dark-roast/deck.png';
import darkRoastFill from '@assets/screens/dark-roast/fill.png';
import darkRoastGame from '@assets/screens/dark-roast/game.png';
import darkRoastLesson from '@assets/screens/dark-roast/lesson.png';
import darkRoastTerm from '@assets/screens/dark-roast/term.png';
import darkRoastToday from '@assets/screens/dark-roast/today.png';
import type { Mood } from '@domains/site/mood';
import type { ScreenId } from '@domains/site/screens';
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
    game: cuppingGame,
  },
  'dark-roast': {
    today: darkRoastToday,
    lesson: darkRoastLesson,
    fill: darkRoastFill,
    deck: darkRoastDeck,
    term: darkRoastTerm,
    game: darkRoastGame,
  },
};

interface PhoneShotProps {
  screen: ScreenId;
  alt: string;
  /** Rendered width hint for the image optimiser, e.g. "270px". */
  sizes: string;
  /** Classes for the frame. A rising shot sets how low it sits with e.g. `[--rise-offset:30%]`. */
  className?: string;
  /** Shown on the first screen: the Cupping shot loads ahead of other images. */
  aboveFold?: boolean;
  /** Rises into place, to `--rise-offset` below the card's edge, when its revealed card scrolls in. */
  rises?: boolean;
}

/**
 * An app screenshot in a phone frame, in the page's mood. The Dark Roast shot
 * lies over the Cupping one and fades in with the mood switch.
 */
export function PhoneShot({ screen, alt, sizes, className, aboveFold, rises }: PhoneShotProps) {
  return (
    <div
      className={cn(
        'relative aspect-phone overflow-hidden rounded-[16.3%/7.8%] bg-phone-frame',
        className,
      )}
      data-rise={rises ? '' : undefined}
    >
      <div className="absolute inset-x-[3.2%] inset-y-[1.53%] overflow-hidden rounded-[14%/6.46%] bg-bg">
        <Image
          src={SCREEN_SHOTS.cupping[screen]}
          alt={alt}
          fill
          sizes={sizes}
          loading={aboveFold ? 'eager' : undefined}
          fetchPriority={aboveFold ? 'high' : undefined}
          className="object-cover"
        />
        {/* Cupping is the default mood, so only its shot is loaded ahead of the page. */}
        <Image
          src={SCREEN_SHOTS['dark-roast'][screen]}
          alt=""
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-opacity duration-[450ms] dark-roast:opacity-100"
        />
      </div>
    </div>
  );
}
