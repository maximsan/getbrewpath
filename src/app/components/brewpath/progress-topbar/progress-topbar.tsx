import { useTranslations } from 'next-intl';

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
  const fromChannels = hexChannels(ROAST_RAMP[index] ?? ROAST_RAMP[0]);
  const toChannels = hexChannels(ROAST_RAMP[index + 1] ?? ROAST_RAMP[0]);

  return `#${fromChannels
    .map((channel, i) =>
      Math.round(channel + ((toChannels[i] ?? channel) - channel) * fraction)
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
        <ellipse
          cx="12"
          cy="12"
          rx="7.5"
          ry="9.5"
          fill={fill}
          className="transition-[fill] duration-[420ms] ease-[cubic-bezier(0.34,1.18,0.5,1)]"
        />
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

const padCount = (count: number) => String(count).padStart(COUNTER_DIGITS, '0');

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
  const translate = useTranslations('lesson');
  /** The card number the counter shows, counting from one. */
  const cardNumber = done ? total : pos + 1;

  return (
    // Sits under the phone's status bar; the demo's content clears it with 134px of top padding.
    // The bar's solid top covers the gap under the phone's status bar, so scrolled content
    // stays hidden behind the clock.
    <div className="absolute inset-x-0 top-status-bar z-10 grid grid-cols-[32px_1fr_32px] items-center border-b border-rule bg-bg px-5 py-3 before:absolute before:inset-x-0 before:bottom-full before:h-status-bar before:bg-inherit">
      {/* A 44px hit area without a 44px box: the glyph stays where it is aligned. */}
      <button
        type="button"
        className="relative flex appearance-none items-center justify-center justify-self-start border-0 bg-transparent p-1 text-ink before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-1/2"
        onClick={onClose}
        aria-label={closeLabel ?? translate('close')}
      >
        <CloseMark />
      </button>
      <div className="flex items-center justify-center gap-2.5">
        <RoastBean done={cardNumber} total={total} />
        <span className="ff-mono text-label tracking-[0.12em] text-ink-mute uppercase">
          {padCount(cardNumber)} / {padCount(total)}
        </span>
      </div>
    </div>
  );
}
