import Image from 'next/image';
import type { CSSProperties } from 'react';

import { MOOD_ONLY } from '@components/mood/mood-only';
import type { Mood } from '@domains/site/mood';
import { SCREEN_ASPECT, type ScreenId, screenShots, screenSrc } from '@domains/site/screens';
import { cn } from '@shared/styles/cn';

interface PhoneShotProps {
  screen: ScreenId;
  alt: string;
  /** Rendered width hint for the image optimiser, e.g. "270px". */
  sizes: string;
  /** Always show this mood's screenshot; by default it follows the page's mood. */
  mood?: Mood;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  /** Rises into place when its revealed card scrolls in; the value is how far it sits below the card's edge. */
  riseOffset?: string;
}

/** An app screenshot in a rounded phone silhouette, in the page's mood. */
export function PhoneShot({
  screen,
  alt,
  sizes,
  mood,
  className,
  style,
  priority,
  riseOffset,
}: PhoneShotProps) {
  const shots = mood ? [{ mood, src: screenSrc(screen, mood) }] : screenShots(screen);

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
      {shots.map((shot) => (
        // The screenshots carry a thin device edge; scaling past it hides the edge inside the frame.
        <Image
          key={shot.src}
          src={shot.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('scale-[1.06] object-cover', !mood && MOOD_ONLY[shot.mood])}
        />
      ))}
    </div>
  );
}
