import Image from 'next/image';

import { type ScreenId, screenSrc } from '@domains/site/screens';
import { cn } from '@shared/styles/cn';

interface PhoneShotProps {
  screen: ScreenId;
  alt: string;
  /** Rendered width hint for the image optimiser, e.g. "270px". */
  sizes: string;
  /** Classes for the frame. A rising shot sets how low it sits with e.g. `[--rise-offset:30%]`. */
  className?: string;
  priority?: boolean;
  /** Rises into place, to `--rise-offset` below the card's edge, when its revealed card scrolls in. */
  rises?: boolean;
}

/**
 * An app screenshot in a phone frame, in the page's mood. The Dark Roast shot
 * lies over the Cupping one and fades in with the mood switch.
 */
export function PhoneShot({ screen, alt, sizes, className, priority, rises }: PhoneShotProps) {
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
