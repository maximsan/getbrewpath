'use client';

import { type ReactNode, useRef } from 'react';

import { useFitScale } from '@shared/hooks/use-fit-scale';

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

  return (
    <div
      ref={box}
      className="relative w-full"
      style={{ maxWidth: width, aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width,
          height,
          transform: `scale(${shownWidth / width})`,
          visibility: measured ? undefined : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
