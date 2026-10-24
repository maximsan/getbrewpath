import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@shared/styles/cn';

/** A page band: centred, 1160px wide, with the prototype's fluid top spacing. */
export function Section({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section className={cn('page-width px-6 pt-[clamp(64px,9vw,120px)]', className)} {...props} />
  );
}

export const sectionTitleClass =
  'ff-display m-0 text-[clamp(28px,3.6vw,44px)] leading-[1.05] font-normal tracking-[-0.02em] text-balance';

export const pageTitleClass =
  'ff-display m-0 text-[clamp(36px,5vw,60px)] leading-[1.02] font-normal tracking-[-0.025em] text-balance';

/** A centred section heading that fades in. */
export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div data-reveal className="mx-auto max-w-[720px] text-center">
      <h2 className={sectionTitleClass}>{children}</h2>
    </div>
  );
}

/** Two 380px columns that stack on narrow screens. Children can restyle the stacked layout with `stacked:`. */
export const twoColumnClass =
  '@container grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-10';

/** A small mono caption: the uppercase notes under buttons and above lists. */
export const monoNoteClass =
  'ff-mono text-[11px] leading-normal tracking-[.08em] text-ink-mute uppercase';
