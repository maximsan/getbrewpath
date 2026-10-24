import { useTranslations } from 'next-intl';

import { cn } from '@shared/styles/cn';

import { FlavorStamp } from './flavor-stamp';
import styles from './reward-card.module.css';

/** The collectible a lesson or module awards. */
export interface RewardCardData {
  /** e.g. "The Coffee Cherry". */
  title: string;
  /** One or two sentences under the title. */
  summary: string;
  /** The line under "Memorable", set in the display face. */
  fact: string;
  /** Spec rows as [label, value] pairs, e.g. ["Family", "Rubiaceae"]. */
  meta?: readonly (readonly [label: string, value: string])[];
  /** Line above the title. Defaults to "Coffee card". */
  badge?: string;
}

export interface RewardCardProps {
  reward: RewardCardData;
}

/**
 * The earned card: badge, title, stamp, summary, spec rows and a memorable fact.
 * It rises in once on mount. No client hooks besides `useTranslations`, so it
 * renders in both server and client trees.
 */
export function RewardCard({ reward }: RewardCardProps) {
  const translate = useTranslations('reward');
  const rows = reward.meta ?? [];

  return (
    <div
      className={cn(
        'relative w-full max-w-[320px] rounded-[2px] bg-surface px-6 pt-8 pb-6',
        styles.card,
      )}
    >
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 rounded-[2px]', styles.ring)}
      />

      {/* The right padding reserves the stamp's corner: 14px inset + 68px stamp + 10px gap. */}
      <div className="pr-[92px]">
        <div className="smallcaps mb-2">{reward.badge ?? translate('coffeeCard')}</div>
        <h2 className="ff-display m-0 text-title leading-[1.05] font-normal tracking-[-0.02em] text-pretty text-ink">
          {reward.title}
        </h2>
      </div>

      <div className="absolute top-3.5 right-3.5">
        <FlavorStamp />
      </div>

      <p className="mt-5 mb-0 text-support leading-normal text-pretty text-ink-mute">
        {reward.summary}
      </p>

      <dl className="mt-5 mb-0">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-rule py-3.5 last:border-b-0"
          >
            <dt className="smallcaps">{label}</dt>
            <dd className="ff-mono m-0 text-right text-support whitespace-nowrap text-ink">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 border-t border-rule pt-3.5">
        <div className="smallcaps mb-1.5">{translate('memorable')}</div>
        <p className="ff-display m-0 text-heading leading-[1.4] font-normal text-pretty text-ink">
          {reward.fact}
        </p>
      </div>
    </div>
  );
}
