'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { type ReactNode, useEffect } from 'react';

import { BAR_COLOR_OF_SCHEME, COLOR_SCHEMES, MOOD_STORAGE_KEY } from './mood-scheme';

/**
 * Puts the visitor's setting on `<html data-scheme>` before paint, and the CSS
 * shows the matching mood. A first visit follows the phone's light or dark
 * setting, as the app does. A pick from the mood switch is remembered and wins
 * from then on.
 */
export function MoodProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-scheme"
      themes={[...COLOR_SCHEMES]}
      defaultTheme="system"
      enableSystem
      storageKey={MOOD_STORAGE_KEY}
      disableTransitionOnChange={false}
    >
      <BarColor />
      {children}
    </ThemeProvider>
  );
}

/**
 * Keeps the browser bar in the mood's colour. The layout's `theme-color` tags
 * follow only the phone's setting, so a pick from the mood switch rewrites them.
 */
function BarColor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const scheme = COLOR_SCHEMES.find((known) => known === resolvedTheme);
    if (!scheme) return;
    const color = BAR_COLOR_OF_SCHEME[scheme];
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((tag) => tag.setAttribute('content', color));
  }, [resolvedTheme]);

  return null;
}
