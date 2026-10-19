'use client';

import { type RefObject, useEffect, useState } from 'react';

/**
 * How far to shrink a drawing `designWidth` wide so it fits `container`:
 * the container's width over `designWidth`, capped at 1. It is 0 until the
 * container has been measured, which happens only in the browser.
 */
export function useFitScale(container: RefObject<HTMLElement | null>, designWidth: number) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setScale(Math.min(1, entry.contentRect.width / designWidth));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [container, designWidth]);

  return scale;
}
