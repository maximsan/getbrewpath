'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { COLOR_SCHEMES, MOOD_OF_SCHEME, MOOD_STORAGE_KEY } from '@domains/site/mood';

/**
 * Puts the mood on `<html data-mood>` before paint. A first visit follows the
 * phone's light or dark setting, as the app does; a pick from the mood switch
 * is remembered and wins from then on.
 */
export function MoodProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-mood"
      themes={COLOR_SCHEMES}
      value={MOOD_OF_SCHEME}
      defaultTheme="system"
      enableSystem
      storageKey={MOOD_STORAGE_KEY}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
