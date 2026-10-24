'use client';

import { type CSSProperties, type ReactNode, useId, useState } from 'react';

import { cn } from '@shared/styles/cn';

import styles from './disclosure.module.css';

/** "caret" for lists of things; "plus" for a prose answer such as an FAQ. */
export type DisclosureGlyph = 'caret' | 'plus';

/** Either the disclosure keeps its own open state, or the parent decides it, e.g. one answer open at a time. */
type OpenState =
  | {
      /** Starts open. Defaults to false. */
      defaultOpen?: boolean;
      open?: never;
      onToggle?: never;
    }
  | { defaultOpen?: never; open: boolean; onToggle: () => void };

export type DisclosureProps = OpenState & {
  /** Header text. */
  label: ReactNode;
  /** Defaults to "caret". */
  glyph?: DisclosureGlyph;
  /** CSS padding of the header button. Defaults to "16px 0". */
  headerPad?: string;
  /** How long opening and closing take. Defaults to 240. */
  durationMs?: number;
  children: ReactNode;
};

const PLUS_SIZE = 12;
const CARET_SIZE = 18;

function Glyph({ glyph, open }: { glyph: DisclosureGlyph; open: boolean }) {
  const shared = {
    'aria-hidden': true,
    className: cn(styles.glyph, 'text-ink-mute'),
    'data-glyph': glyph,
    'data-open': open || undefined,
  } as const;

  if (glyph === 'plus') {
    return (
      <svg width={PLUS_SIZE} height={PLUS_SIZE} viewBox="0 0 12 12" {...shared}>
        <path
          d="M6 1v10M1 6h10"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width={CARET_SIZE} height={CARET_SIZE} viewBox="0 0 20 20" {...shared}>
      <path
        d="M5 8 L10 13 L15 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** An expand and collapse section: a header button with a glyph, and a panel whose height animates. */
export function Disclosure({
  label,
  glyph = 'caret',
  headerPad = '16px 0',
  defaultOpen = false,
  open: openProp,
  onToggle,
  durationMs,
  children,
}: DisclosureProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const panelId = useId();
  const open = openProp ?? openState;
  const toggle = onToggle ?? (() => setOpenState((wasOpen) => !wasOpen));

  return (
    <div
      className={styles.root}
      style={
        durationMs === undefined
          ? undefined
          : ({ '--disclosure-ms': `${durationMs}ms` } as CSSProperties)
      }
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className="block w-full cursor-pointer appearance-none border-none bg-transparent text-left text-inherit"
        style={{ padding: headerPad }}
      >
        <span className="flex w-full items-center justify-between gap-3">
          <span className="text-body text-ink">{label}</span>
          <Glyph glyph={glyph} open={open} />
        </span>
      </button>
      <div id={panelId} className={styles.panel} data-open={open || undefined}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
