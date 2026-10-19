import Link from 'next/link';
import type { ComponentProps } from 'react';

import { cn } from '@shared/styles/cn';

const TONES = {
  ink: 'bg-ink text-bg',
  accent: 'bg-accent text-accent-ink',
  outline: 'border border-rule text-ink',
} as const;

const SIZES = {
  sm: 'min-h-9 px-[18px] py-1.5 text-sm',
  md: 'min-h-[42px] px-[18px] py-2 text-sm',
  lg: 'min-h-12 px-[22px] py-2.5 text-[15px]',
  xl: 'min-h-[50px] px-[22px] py-3 text-[15px]',
  hero: 'min-h-14 px-7 py-3.5 text-base',
} as const;

/** The pill-shaped call to action every page uses. */
export const linkButtonClass = (tone: keyof typeof TONES, size: keyof typeof SIZES) =>
  cn(
    'ff-ui inline-flex items-center justify-center rounded-full text-center leading-[1.15] font-medium transition-transform duration-150',
    'hover:no-underline hover:brightness-[1.06] active:scale-[.97]',
    TONES[tone],
    SIZES[size],
  );

interface LinkButtonProps extends ComponentProps<typeof Link> {
  tone: keyof typeof TONES;
  size: keyof typeof SIZES;
}

export function LinkButton({ tone, size, className, ...props }: LinkButtonProps) {
  return <Link className={cn(linkButtonClass(tone, size), className)} {...props} />;
}
