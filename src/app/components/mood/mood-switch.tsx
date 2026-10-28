'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { useHydrated } from '@shared/hooks/use-hydrated';
import { cn } from '@shared/styles/cn';

import type { ColorScheme } from './mood-scheme';

const labelClass =
  'ff-mono relative z-1 flex appearance-none items-center justify-center rounded-full px-2.25 text-center whitespace-nowrap text-[9.5px] leading-tight tracking-[.14em] uppercase transition-colors duration-300 tablet:px-3';

/**
 * The header's Light and Dark buttons, one per mood, so that each button's
 * spoken name is the word it shows. The knob position and label colours come
 * from `html[data-scheme]` in CSS, so the server render already matches the
 * stored mood and nothing jumps on hydration. A label never wraps: browsers
 * disagree on how wide a wrapping label makes its column, and Safari on iPhone
 * pushed the header off screen.
 */
export function MoodSwitch() {
  const translate = useTranslations('nav');

  return (
    <div
      role="group"
      aria-label={translate('moodSwitch')}
      className="relative grid h-9 flex-none grid-cols-2 items-stretch rounded-full border border-rule bg-surface p-0.75 text-ink-mute"
    >
      <span
        aria-hidden
        className="absolute inset-y-0.75 inset-s-0.75 w-[calc(50%-3px)] rounded-full bg-ink transition-transform duration-300 ease-soft dark-roast:translate-x-full"
      />
      <MoodButton scheme="light" className="text-bg dark-roast:text-ink-mute">
        {translate('moodLight')}
      </MoodButton>
      <MoodButton scheme="dark" className="text-ink-mute dark-roast:text-bg">
        {translate('moodDark')}
      </MoodButton>
    </div>
  );
}

/** The button that picks the mood shown for `scheme`, pressed while that mood is on. */
function MoodButton({
  scheme,
  className,
  children,
}: {
  scheme: ColorScheme;
  className: string;
  children: ReactNode;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();

  return (
    <button
      type="button"
      aria-pressed={hydrated ? resolvedTheme === scheme : undefined}
      onClick={() => setTheme(scheme)}
      className={cn(labelClass, className)}
    >
      {children}
    </button>
  );
}
