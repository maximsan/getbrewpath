'use client';

import { type ReactNode, useId, useState } from 'react';

import { cn } from '@shared/styles/cn';

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
  /** Padding classes for the header button. Defaults to "py-4". */
  headerClassName?: string;
  /**
   * Classes for the whole disclosure. Opening and closing take `--disclosure-ms`, 240ms
   * unless a class such as `[--disclosure-ms:380ms]` sets it.
   */
  className?: string;
  children: ReactNode;
};

const PLUS_SIZE = 12;
const CARET_SIZE = 18;

/** How the glyph turns when the panel is open: the caret flips, the plus turns into a cross. */
const OPEN_TURN: Record<DisclosureGlyph, string> = { caret: 'rotate-180', plus: 'rotate-45' };

function Glyph({ glyph, open }: { glyph: DisclosureGlyph; open: boolean }) {
  const className = cn(
    'flex-none text-ink-mute transition-transform duration-(--disclosure-ms) ease-in-out',
    open && OPEN_TURN[glyph],
  );

  if (glyph === 'plus') {
    return (
      <svg
        width={PLUS_SIZE}
        height={PLUS_SIZE}
        viewBox="0 0 12 12"
        aria-hidden
        className={className}
      >
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
    <svg
      width={CARET_SIZE}
      height={CARET_SIZE}
      viewBox="0 0 20 20"
      aria-hidden
      className={className}
    >
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

/**
 * An expand and collapse section: a header button with a glyph, and a panel whose height
 * animates. The height runs through a grid row from 0fr to 1fr, so it needs no measured height.
 */
export function Disclosure({
  label,
  glyph = 'caret',
  headerClassName = 'py-4',
  defaultOpen = false,
  open: openProp,
  onToggle,
  className,
  children,
}: DisclosureProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const panelId = useId();
  const open = openProp ?? openState;
  const toggle = onToggle ?? (() => setOpenState((wasOpen) => !wasOpen));

  return (
    <div className={cn('[--disclosure-ms:240ms]', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className={cn(
          'block w-full cursor-pointer appearance-none border-none bg-transparent px-0 text-left text-inherit',
          headerClassName,
        )}
      >
        <span className="flex w-full items-center justify-between gap-3">
          <span className="text-body text-ink">{label}</span>
          <Glyph glyph={glyph} open={open} />
        </span>
      </button>
      <div
        id={panelId}
        className={cn(
          'grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--disclosure-ms) ease-[cubic-bezier(0.2,0.8,0.2,1)]',
          open && 'grid-rows-[1fr]',
        )}
      >
        {/*
          A collapsed 0fr row still lets its content take focus, so collapsed content is also
          hidden from the tab order, once the collapse animation has finished.
        */}
        <div
          className={cn(
            'min-h-0 overflow-hidden transition-[visibility] duration-0',
            open ? 'visible delay-0' : 'invisible delay-(--disclosure-ms)',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
