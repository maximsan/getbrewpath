import Image from 'next/image';
import type { CSSProperties } from 'react';

import { PHONE_ASPECT, type ScreenId, screenSrc } from '@domains/site/screens';
import { cn } from '@shared/styles/cn';

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

/**
 * An app screenshot in a phone frame, in the page's mood. The Dark Roast shot
 * lies over the Cupping one and fades in with the mood switch.
 */
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
      className={cn('relative overflow-hidden rounded-[16.3%/7.8%] bg-phone-frame', className)}
      style={{
        aspectRatio: PHONE_ASPECT,
        ...(riseOffset ? ({ '--y': riseOffset } as CSSProperties) : null),
        ...style,
      }}
      data-rise={riseOffset ? '' : undefined}
    >
      <div className="absolute inset-x-[3.2%] inset-y-[1.53%] overflow-hidden rounded-[14%/6.46%] bg-bg">
        <Image
          src={screenSrc(screen, 'cupping')}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
        {/* Cupping is the default mood, so only its shot is loaded ahead of the page. */}
        <Image
          src={screenSrc(screen, 'dark-roast')}
          alt=""
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-opacity duration-[450ms] in-data-[mood=dark-roast]:opacity-100"
        />
      </div>
    </div>
  );
}
