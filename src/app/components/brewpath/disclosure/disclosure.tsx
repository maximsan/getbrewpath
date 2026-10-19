'use client';

import { type ReactNode, useId, useState } from 'react';

import { cn } from '@shared/styles/cn';

import styles from './disclosure.module.css';

/** "caret" for lists of things; "plus" for a prose answer such as an FAQ. */
export type DisclosureGlyph = 'caret' | 'plus';

export interface DisclosureProps {
  /** Header text. */
  label: ReactNode;
  /** Defaults to "caret". */
  glyph?: DisclosureGlyph;
  /** Draws a rule under the whole section. */
  divider?: boolean;
  /** CSS padding of the header button. Defaults to "16px 0". */
  headerPad?: string;
  /** Starts open. Defaults to false. */
  defaultOpen?: boolean;
  children: ReactNode;
}

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
  divider = false,
  headerPad = '16px 0',
  defaultOpen = false,
  children,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={cn(styles.root, divider && 'border-b border-rule')}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
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
