'use client';

import { type ReactNode, useRef } from 'react';

import { useFitScale } from '@shared/hooks/use-fit-scale';

interface ScaledFrameProps {
  /** The size the content is drawn at. */
  width: number;
  height: number;
  /** The widest it is shown; defaults to `width`. */
  maxWidth?: number;
  children: ReactNode;
}

/**
 * Shows fixed-size content shrunk to fit its container. The box takes its
 * final size from CSS on first paint, so the page never shifts when the
 * scale is measured; only the drawing inside is scaled, and it stays hidden
 * until then.
 */
export function ScaledFrame({ width, height, maxWidth = width, children }: ScaledFrameProps) {
  const box = useRef<HTMLDivElement>(null);
  const shownWidth = useFitScale(box, maxWidth) * maxWidth;
  const measured = shownWidth > 0;

  return (
    <div
      ref={box}
      className="relative w-full"
      style={{ maxWidth, aspectRatio: `${width} / ${height}` }}
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
