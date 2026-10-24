import Image from 'next/image';
import type { CSSProperties } from 'react';

import { MOOD_ONLY } from '@components/mood/mood-only';
import { SCREEN_ASPECT, type ScreenId, screenShots } from '@domains/site/screens';
import { cn } from '@shared/styles/cn';

interface PhoneShotProps {
  screen: ScreenId;
  alt: string;
  /** Rendered width hint for the image optimiser, e.g. "270px". */
  sizes: string;
  className?: string;
  style?: CSSProperties;
  /** Shown on the first screen: loads at once, ahead of other images. */
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
          loading={aboveFold ? 'eager' : 'lazy'}
          fetchPriority={aboveFold ? 'high' : undefined}
          className={cn('scale-[1.06] object-cover', MOOD_ONLY[shot.mood])}
        />
      ))}
    </div>
  );
}
