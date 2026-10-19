'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const REVEAL_SELECTOR = '[data-reveal]:not(.in)';
const REVEAL_OPTIONS: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px 0px -5% 0px' };

/**
 * Fades `[data-reveal]` blocks up as they scroll into view. The hidden start
 * state only applies under `html.js` (set by the layout's inline script), so
 * content stays visible without JavaScript.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    }, REVEAL_OPTIONS);
    document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
