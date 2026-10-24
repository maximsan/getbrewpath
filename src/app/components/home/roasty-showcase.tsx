'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { RoastyState } from '@components/brewpath/roasty/roasty';
import { RoastyButton } from '@components/roasty-button/roasty-button';
import { sectionTitleClass, twoColumnClass } from '@components/section/section';
import { cn } from '@shared/styles/cn';

/** The moments a visitor can play, in chip order. */
const MOMENTS = [
  'idle',
  'correct',
  'wrong',
  'lesson',
  'module',
  'sleep',
] as const satisfies readonly RoastyState[];

type Moment = (typeof MOMENTS)[number];

export function RoastyShowcase() {
  const translate = useTranslations('roasty');
  const [moment, setMoment] = useState<Moment>('idle');
  /** Bumped on every play, so playing the current moment again replays it. */
  const [replayCount, setReplayCount] = useState(0);

  const playMoment = (nextMoment: Moment) => {
    setMoment(nextMoment);
    setReplayCount((count) => count + 1);
  };

  /** A tap on Roasty plays one of his moments at random, skipping the one now showing and his resting one. */
  const playRandomMoment = () => {
    const otherMoments = MOMENTS.filter(
      (candidate) => candidate !== 'idle' && candidate !== moment,
    );
    const nextMoment = otherMoments[Math.floor(Math.random() * otherMoments.length)];

    if (nextMoment) {
      playMoment(nextMoment);
    }
  };

  return (
    <div className={twoColumnClass}>
      <div
        data-reveal
        className="relative order-2 flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-rule bg-surface px-6 py-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_60%)]" />
        <RoastyButton
          label={translate('playMoment')}
          onClick={playRandomMoment}
          className="relative min-h-[290px]"
          state={moment}
          replayKey={replayCount}
          size="large"
        />
        <p
          aria-live="polite"
          className="ff-display relative mt-2 mb-0 min-h-[26px] text-center text-[19px] text-ink-mute italic"
        >
          {translate(`lines.${moment}`)}
        </p>
      </div>
      <div data-reveal className="order-1">
        <h2 className={sectionTitleClass}>{translate('title')}</h2>
        <p className="ff-ui mt-[18px] mb-0 max-w-[46ch] text-base leading-[1.6] text-pretty text-ink-mute">
          {translate('body')}
        </p>
        <div
          id="roasty-moments"
          className="ff-mono mt-7 mb-3 text-[11px] tracking-[.14em] text-ink-mute uppercase"
        >
          {translate('tapMoment')}
        </div>
        <div role="group" aria-labelledby="roasty-moments" className="flex flex-wrap gap-2">
          {MOMENTS.map((chipMoment) => {
            const isPlaying = moment === chipMoment;

            return (
              <button
                key={chipMoment}
                type="button"
                aria-pressed={isPlaying}
                onClick={() => playMoment(chipMoment)}
                className={cn(
                  'ff-ui min-h-9 appearance-none rounded-full border px-3.5 py-1.5 text-[13px] leading-[1.15] font-medium transition-all duration-200',
                  isPlaying
                    ? 'border-accent bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-accent'
                    : 'border-rule bg-transparent text-ink',
                )}
              >
                {translate(`chips.${chipMoment}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
