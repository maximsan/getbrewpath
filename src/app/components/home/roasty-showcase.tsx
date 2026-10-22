'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Roasty, type RoastyState } from '@components/brewpath/roasty/roasty';
import { sectionTitleClass, twoColumnClass } from '@components/section/section';
import { cn } from '@shared/styles/cn';

/** The moments a visitor can tap, in chip order. */
const MOMENTS = [
  'idle',
  'correct',
  'wrong',
  'lesson',
  'module',
  'sleep',
] as const satisfies readonly RoastyState[];
type Moment = (typeof MOMENTS)[number];

const ROASTY_SIZE = 200;

export function RoastyShowcase() {
  const t = useTranslations('roasty');
  const [moment, setMoment] = useState<Moment>('idle');
  /** Bumped on every tap, so tapping the current moment plays it again. */
  const [replay, setReplay] = useState(0);

  const pick = (next: Moment) => {
    setMoment(next);
    setReplay((current) => current + 1);
  };

  return (
    <div className={twoColumnClass}>
      <div
        data-reveal
        className="relative order-2 flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-rule bg-surface px-6 py-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_60%)]" />
        <div className="relative flex min-h-[290px] items-center justify-center">
          <Roasty
            state={moment}
            replayKey={replay}
            size={ROASTY_SIZE}
            hat="beanie"
            gear="none"
            sprout="sprig"
            roast="medium"
          />
        </div>
        <p
          aria-live="polite"
          className="ff-display relative mt-2 mb-0 min-h-[26px] text-center text-[19px] text-ink-mute italic"
        >
          {t(`lines.${moment}`)}
        </p>
      </div>
      <div data-reveal className="order-1">
        <h2 className={sectionTitleClass}>{t('title')}</h2>
        <p className="ff-ui mt-[18px] mb-0 max-w-[46ch] text-base leading-[1.6] text-pretty text-ink-mute">
          {t('body')}
        </p>
        <div
          id="roasty-moments"
          className="ff-mono mt-7 mb-3 text-[11px] tracking-[.14em] text-ink-mute uppercase"
        >
          {t('tapMoment')}
        </div>
        <div role="group" aria-labelledby="roasty-moments" className="flex flex-wrap gap-2">
          {MOMENTS.map((id) => {
            const on = moment === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => pick(id)}
                className={cn(
                  'ff-ui min-h-9 appearance-none rounded-full border px-3.5 py-1.5 text-[13px] leading-[1.15] font-medium transition-all duration-200',
                  on
                    ? 'border-accent bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-accent'
                    : 'border-rule bg-transparent text-ink',
                )}
              >
                {t(`chips.${id}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
