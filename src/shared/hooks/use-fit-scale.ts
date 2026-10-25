'use client';

import { type RefObject, useEffect, useState } from 'react';

/**
 * How far to shrink `content` so it fits the width of `container`: the container's width
 * over the content's own width, capped at 1. It is 0 until both have been measured, which
 * happens only in the browser. The content's own width ignores any scale applied to it.
 */
export function useFitScale(
  container: RefObject<HTMLElement | null>,
  content: RefObject<HTMLElement | null>,
) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const containerElement = container.current;
    const contentElement = content.current;

    if (!containerElement || !contentElement) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const contentWidth = contentElement.offsetWidth;

      if (contentWidth > 0) {
        setScale(Math.min(1, containerElement.clientWidth / contentWidth));
      }
    });

    observer.observe(containerElement);
    observer.observe(contentElement);

    return () => observer.disconnect();
  }, [container, content]);

  return scale;
}
