'use client';

import { type ReactNode, useEffect } from 'react';

/** Set once the first page has shown. Every page after it arrived by a route change. */
let firstPageShown = false;

/**
 * Each route change fades the new page up, as the prototype's page switch does.
 * The first page shows at once: starting it invisible delays its first paint.
 */
export default function Template({ children }: { children: ReactNode }) {
  const fadesIn = firstPageShown;

  useEffect(() => {
    firstPageShown = true;
  }, []);

  return (
    <div className={fadesIn ? 'animate-[page-in_0.3s_var(--ease-out-soft)_both]' : undefined}>
      {children}
    </div>
  );
}
