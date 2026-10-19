import Image from 'next/image';
import type { CSSProperties } from 'react';

import { cn } from '@shared/styles/cn';
import { SCREEN_ASPECT, type ScreenId, screenSrc } from '@domains/site/screens';

interface PhoneShotProps {
  screen: ScreenId;
  alt: string;
  /** Rendered width hint for the image optimiser, e.g. "270px". */
  sizes: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  /** Rises into place when its revealed card scrolls in; the value is how far it sits below the card's edge. */
  riseOffset?: string;
}

/** An app screenshot in a rounded phone silhouette. */
export function PhoneShot({
  screen,
  alt,
  sizes,
  className,
  style,
  priority,
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
      {/* The screenshots carry a thin device edge; scaling past it hides the edge inside the frame. */}
      <Image
        src={screenSrc(screen)}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="scale-[1.06] object-cover"
      />
    </div>
  );
}
