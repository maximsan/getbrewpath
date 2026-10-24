'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { RoastyButton } from '@components/roasty-button/roasty-button';

/** How long a tapped Roasty stays awake before he dozes off again. */
const AWAKE_MS = 2600;

/** A sleeping Roasty who wakes up for a moment when tapped. */
export function SleepingRoasty({ size }: { size: number }) {
  const translate = useTranslations('notfound');
  const [awake, setAwake] = useState(false);
  /** Bumped on every tap, so a tap while he is awake plays the wake-up again. */
  const [wakeCount, setWakeCount] = useState(0);

  useEffect(() => {
    if (!awake) {
      return;
    }

    const dozeOff = setTimeout(() => setAwake(false), AWAKE_MS);

    return () => clearTimeout(dozeOff);
  }, [awake, wakeCount]);

  const wake = () => {
    setAwake(true);
    setWakeCount((count) => count + 1);
  };

  return (
    <RoastyButton
      label={translate('wakeRoasty')}
      onClick={wake}
      className="min-h-60"
      state={awake ? 'awake' : 'sleep'}
      replayKey={wakeCount}
      size={size}
    />
  );
}
