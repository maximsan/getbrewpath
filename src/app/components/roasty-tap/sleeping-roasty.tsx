'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Roasty } from '@components/brewpath/roasty/roasty';
import { cn } from '@shared/styles/cn';

import { roastyTapClass } from './roasty-tap';

/** How long a tapped Roasty stays awake before he dozes off again. */
const AWAKE_MS = 2600;

/** A sleeping Roasty who wakes up for a moment when tapped. */
export function SleepingRoasty({ size }: { size: number }) {
  const t = useTranslations('notfound');
  const [awake, setAwake] = useState(false);
  /** Bumped on every tap, so a tap while he is awake plays the wake-up again. */
  const [wakes, setWakes] = useState(0);

  useEffect(() => {
    if (!awake) return;
    const doze = setTimeout(() => setAwake(false), AWAKE_MS);
    return () => clearTimeout(doze);
  }, [awake, wakes]);

  const wake = () => {
    setAwake(true);
    setWakes((count) => count + 1);
  };

  return (
    <button
      type="button"
      aria-label={t('wakeRoasty')}
      onClick={wake}
      className={cn('flex min-h-60 items-center justify-center', roastyTapClass)}
    >
      <Roasty
        state={awake ? 'awake' : 'sleep'}
        replayKey={wakes}
        size={size}
        hat="beanie"
        gear="none"
        sprout="sprig"
      />
    </button>
  );
}
