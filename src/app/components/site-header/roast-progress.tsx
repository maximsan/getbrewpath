'use client';

import { useEffect, useRef } from 'react';

/**
 * A thin bar along the header's bottom edge that grows with how far the page
 * is scrolled. Its colour runs from a raw green bean to a dark roast.
 */
export function RoastProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const draw = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      bar.current?.style.setProperty('clip-path', `inset(0 ${(1 - progress) * 100}% 0 0)`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden
      // A clip, not a scale, uncovers the bar: each colour stays at its place across the screen.
      className="pointer-events-none absolute inset-x-0 -bottom-px z-[1] h-[3px] bg-[linear-gradient(90deg,var(--art-raw)_0%,var(--art-roast-light)_25%,var(--art-roast-mid)_50%,var(--art-roast-deep)_75%,var(--art-roast-dark)_100%)] [clip-path:inset(0_100%_0_0)]"
    />
  );
}
