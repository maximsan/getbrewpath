'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { useHydrated } from '@shared/hooks/use-hydrated';
import { cn } from '@shared/styles/cn';

import { COLOR_SCHEMES, type ColorScheme } from './mood-scheme';

const moodButtonClass =
  'ff-mono relative z-1 flex appearance-none items-center justify-center px-2.25 text-center whitespace-nowrap text-micro/tight tracking-[.14em] uppercase transition-colors duration-300 tablet:px-3';

/** Each button's word colour. The word of the mood that is on sits on the knob, so it takes the page colour. */
const MOOD_BUTTON_CLASSES: Record<ColorScheme, string> = {
  light: 'text-bg dark-roast:text-ink-mute',
  dark: 'text-ink-mute dark-roast:text-bg',
};

const LABEL_KEY_OF_SCHEME = {
  light: 'moodLight',
  dark: 'moodDark',
} as const satisfies Record<ColorScheme, string>;

/**
 * The header's Light and Dark buttons, one per mood, so that each button's
 * name for screen readers and voice control is the word it shows. The knob,
 * the dark pill behind the word of the mood that is on, and the word colours
 * come from `html[data-scheme]` in CSS, so the server render already matches
 * the stored mood and nothing jumps on hydration. A word never wraps: browsers
 * disagree on how wide a wrapping word makes its column, and Safari on iPhone
 * pushed the header off screen.
 */
export function MoodSwitch() {
  const translate = useTranslations('nav');
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();

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
      {COLOR_SCHEMES.map((scheme) => {
        const pressed = resolvedTheme === scheme;

        return (
          <button
            key={scheme}
            type="button"
            aria-pressed={hydrated ? pressed : undefined}
            onClick={() => {
              // setTheme saves even an unchanged pick, and a saved pick stops the site following the phone.
              if (!pressed) {
                setTheme(scheme);
              }
            }}
            className={cn(moodButtonClass, MOOD_BUTTON_CLASSES[scheme])}
          >
            {translate(LABEL_KEY_OF_SCHEME[scheme])}
          </button>
        );
      })}
    </div>
  );
}
