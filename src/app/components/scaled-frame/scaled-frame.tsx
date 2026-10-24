'use client';

import { type ReactNode, useRef } from 'react';

import { useFitScale } from '@shared/hooks/use-fit-scale';
import { cn } from '@shared/styles/cn';
import type { CssVariables } from '@shared/styles/css-variables';

interface ScaledFrameProps {
  /**
   * Classes that give the box its final size on first paint, e.g. a width and an aspect
   * ratio, so the page never shifts when the scale is measured.
   */
  className: string;
  /** Content drawn at its own fixed size. */
  children: ReactNode;
}

/**
 * Shows fixed-size content shrunk to fit the box: it measures the box and the content, and
 * scales only the content. The content stays hidden until the scale is known.
 */
export function ScaledFrame({ className, children }: ScaledFrameProps) {
  const box = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const scale = useFitScale(box, content);
  const scaleVariable: CssVariables = { '--frame-scale': `${scale}` };

  return (
    <div ref={box} className={cn('relative', className)} style={scaleVariable}>
      <div
        ref={content}
        className={cn(
          'absolute top-0 left-0 origin-top-left scale-(--frame-scale)',
          scale === 0 && 'invisible',
        )}
      >
        {children}
      </div>
    </div>
  );
}
