'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { useHydrated } from '@shared/hooks/use-hydrated';
import { cn } from '@shared/styles/cn';

import type { ColorScheme } from './mood-scheme';

/**
 * The header's two-label switch. The knob position and label colours come
 * from `html[data-scheme]` in CSS, so the server render already matches the
 * stored mood and nothing jumps on hydration. A label breaks only where its
 * message has a line break: browsers disagree on how wide a label that wraps on
 * its own makes its column, and Safari on iPhone pushed the header off screen.
 */
export function MoodSwitch() {
  const translate = useTranslations('nav');
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const dark = resolvedTheme === 'dark';
  const next: ColorScheme = dark ? 'light' : 'dark';

  const label =
    'ff-mono relative z-[1] flex items-center justify-center px-[9px] text-center whitespace-pre-line text-[9.5px] leading-[1.25] tracking-[.14em] uppercase transition-colors duration-300 tablet:px-3';

  return (
    <button
      type="button"
      aria-pressed={hydrated ? dark : undefined}
      onClick={() => setTheme(next)}
      aria-label={translate('moodDark')}
      title={translate('moodSwitch')}
      className="relative grid h-9 flex-none appearance-none grid-cols-2 items-stretch rounded-full border border-rule bg-surface p-0.75 text-ink-mute"
    >
      <span
        aria-hidden
        className="absolute inset-y-0.75 inset-s-0.75 w-[calc(50%-3px)] rounded-full bg-ink transition-transform duration-300 ease-soft dark-roast:translate-x-full"
      />
      <span className={cn(label, 'text-bg dark-roast:text-ink-mute')}>
        {translate('moodLight')}
      </span>
      <span className={cn(label, 'text-ink-mute dark-roast:text-bg')}>{translate('moodDark')}</span>
    </button>
  );
}
