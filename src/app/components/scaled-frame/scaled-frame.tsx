'use client';

import { type CSSProperties, type ReactNode, useRef } from 'react';

import { useFitScale } from '@shared/hooks/use-fit-scale';
import { cn } from '@shared/styles/cn';

interface ScaledFrameProps {
  /** The size the content is drawn at. */
  width: number;
  height: number;
  children: ReactNode;
}

/**
 * Shows fixed-size content shrunk to fit its container.
 * The box gets its final size from CSS on first paint, so the page never
 * shifts when the scale is measured. Only the drawing inside is scaled.
 * It stays hidden until the scale is known.
 */
export function ScaledFrame({ width, height, children }: ScaledFrameProps) {
  const box = useRef<HTMLDivElement>(null);
  const shownWidth = useFitScale(box, width) * width;
  const measured = shownWidth > 0;
  const frameSize = {
    '--frame-width': `${width}px`,
    '--frame-height': `${height}px`,
    '--frame-aspect': `${width} / ${height}`,
    '--frame-scale': `${shownWidth / width}`,
  } as CSSProperties;

  return (
    <div
      ref={box}
      className="relative aspect-(--frame-aspect) w-full max-w-(--frame-width)"
      style={frameSize}
    >
      <div
        className={cn(
          'absolute top-0 left-0 h-(--frame-height) w-(--frame-width) origin-top-left scale-(--frame-scale)',
          !measured && 'invisible',
        )}
      >
        {children}
      </div>
    </div>
  );
}
