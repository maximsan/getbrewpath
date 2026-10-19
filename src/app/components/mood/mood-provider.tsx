'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { DEFAULT_MOOD, MOOD_STORAGE_KEY, MOODS } from './mood';

/** Puts the visitor's mood on `<html data-mood>` before paint and remembers it. */
export function MoodProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-mood"
      themes={[...MOODS]}
      defaultTheme={DEFAULT_MOOD}
      enableSystem={false}
      storageKey={MOOD_STORAGE_KEY}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
