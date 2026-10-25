'use client';

import { useEffect, useRef } from 'react';

/**
 * A thin bar along the header's bottom edge that grows with how far the page
 * is scrolled. Its colour runs from a raw green bean to a dark roast.
 */
export function RoastProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /** The animation frame waiting to redraw the bar, or 0 when none is waiting. */
    let pendingFrame = 0;

    const drawBar = () => {
      pendingFrame = 0;

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolledShare =
        scrollableHeight > 0 ? Math.min(1, window.scrollY / scrollableHeight) : 0;
      const hiddenPercent = (1 - scrolledShare) * 100;

      bar.current?.style.setProperty('clip-path', `inset(0 ${hiddenPercent}% 0 0)`);
    };

    /** Redraws at most once per frame, however often the page scrolls. */
    const scheduleDraw = () => {
      if (!pendingFrame) {
        pendingFrame = requestAnimationFrame(drawBar);
      }
    };

    drawBar();
    window.addEventListener('scroll', scheduleDraw, { passive: true });
    window.addEventListener('resize', scheduleDraw);

    return () => {
      cancelAnimationFrame(pendingFrame);
      window.removeEventListener('scroll', scheduleDraw);
      window.removeEventListener('resize', scheduleDraw);
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden
      // A clip, not a scale, uncovers the bar: each colour stays at its place across the screen.
      className="pointer-events-none absolute inset-x-0 -bottom-px z-1 h-0.75 bg-[linear-gradient(90deg,var(--art-raw)_0%,var(--art-roast-light)_25%,var(--art-roast-mid)_50%,var(--art-roast-deep)_75%,var(--art-roast-dark)_100%)] [clip-path:inset(0_100%_0_0)]"
    />
  );
}
