'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { cn } from '@shared/styles/cn';

import type { Mood } from './mood';

/**
 * The header's two-label switch. The knob position and label colours come
 * from `html[data-mood]` in CSS, so the server render already matches the
 * stored mood and nothing jumps on hydration.
 */
export function MoodSwitch() {
  const t = useTranslations('nav');
  const { resolvedTheme, setTheme } = useTheme();
  const next: Mood = resolvedTheme === 'dark-roast' ? 'cupping' : 'dark-roast';

  const label =
    'ff-mono relative z-[1] flex w-min items-center justify-center justify-self-center px-[9px] text-center text-[9.5px] leading-[1.25] tracking-[.14em] uppercase transition-colors duration-300 min-[600px]:px-3';

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={t('moodSwitch')}
      title={t('moodSwitch')}
      className="relative grid h-9 flex-none appearance-none grid-cols-2 items-stretch rounded-full border border-rule bg-surface p-[3px] text-ink-mute"
    >
      <span
        aria-hidden
        className="absolute inset-y-[3px] start-[3px] w-[calc(50%-3px)] rounded-full bg-ink transition-transform duration-300 ease-soft in-data-[mood=dark-roast]:translate-x-full"
      />
      <span className={cn(label, 'text-bg in-data-[mood=dark-roast]:text-ink-mute')}>
        {t('moodLight')}
      </span>
      <span className={cn(label, 'text-ink-mute in-data-[mood=dark-roast]:text-bg')}>
        {t('moodDark')}
      </span>
    </button>
  );
}
