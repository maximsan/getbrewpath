import { useTranslations } from 'next-intl';

import styles from './progress-topbar.module.css';

/** Bean colours from green to dark roast. The bean darkens along this ramp as the learner moves through the cards. */
const ROAST_RAMP = ['#9FB088', '#C79A63', '#A2703C', '#7A4526', '#54301C'] as const;
/** The bean's highlight stroke, the same in both moods. */
const BEAN_CREASE = '#FBF7EE';
const BEAN_SIZE = 22;
const CLOSE_SIZE = 18;
const COUNTER_DIGITS = 2;

function hexChannels(hex: string): number[] {
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
}

/** The ramp colour at progress 0..1, interpolated between neighbouring stops. */
function roastAt(progress: number): string {
  const position = Math.max(0, Math.min(1, progress)) * (ROAST_RAMP.length - 1);
  const index = Math.min(ROAST_RAMP.length - 2, Math.floor(position));
  const fraction = position - index;
  const from = hexChannels(ROAST_RAMP[index] ?? ROAST_RAMP[0]);
  const to = hexChannels(ROAST_RAMP[index + 1] ?? ROAST_RAMP[0]);
  return `#${from
    .map((channel, i) =>
      Math.round(channel + ((to[i] ?? channel) - channel) * fraction)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

function RoastBean({ done, total }: { done: number; total: number }) {
  const fill = roastAt(Math.max(0, Math.min(total, done)) / total);
  return (
    <svg
      width={BEAN_SIZE}
      height={BEAN_SIZE}
      viewBox="0 0 24 24"
      className="block shrink-0"
      aria-hidden="true"
    >
      <g transform="rotate(-18 12 12)">
        <ellipse cx="12" cy="12" rx="7.5" ry="9.5" fill={fill} className={styles.beanFill} />
        <ellipse
          cx="12"
          cy="12"
          rx="7.5"
          ry="9.5"
          fill="none"
          stroke="var(--ink-mute)"
          strokeWidth="1"
        />
        <path
          d="M12 3.5 C 13.5 7, 10.5 9, 12 12 S 13.5 17, 12 20.5"
          fill="none"
          stroke={BEAN_CREASE}
          strokeOpacity="0.34"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function CloseMark() {
  return (
    <svg width={CLOSE_SIZE} height={CLOSE_SIZE} viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M3 3l12 12M15 3L3 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const padCount = (n: number) => String(n).padStart(COUNTER_DIGITS, '0');

export interface ProgressTopbarProps {
  /** Called by the close cross. */
  onClose: () => void;
  /** Zero-based index of the current step. */
  pos: number;
  /** Number of steps. */
  total: number;
  /** Every card is answered: the meter and counter show total of total. */
  done?: boolean;
  /** Spoken name of the close cross; defaults to "Close". */
  closeLabel?: string;
}

/** The top bar while playing a lesson's cards: close on the left, the roast-bean meter and a step counter centred. */
export function ProgressTopbar({
  onClose,
  pos,
  total,
  done = false,
  closeLabel,
}: ProgressTopbarProps) {
  const t = useTranslations('lesson');
  const at = done ? total : pos + 1;
  return (
    <div className={styles.topbar}>
      <button
        type="button"
        className={`${styles.close} flex appearance-none items-center justify-center justify-self-start border-0 bg-transparent p-1 text-ink`}
        onClick={onClose}
        aria-label={closeLabel ?? t('close')}
      >
        <CloseMark />
      </button>
      <div className="flex items-center justify-center gap-2.5">
        <RoastBean done={at} total={total} />
        <span className="ff-mono text-label tracking-[0.12em] text-ink-mute uppercase">
          {padCount(at)} / {padCount(total)}
        </span>
      </div>
    </div>
  );
}
