import type { ComponentProps } from 'react';

import { Link } from '@i18n/navigation';
import { cn } from '@shared/styles/cn';

const TONE_CLASSES = {
  ink: 'bg-ink text-bg',
  accent: 'bg-accent text-accent-ink',
  outline: 'border border-rule text-ink',
} as const;

const SIZE_CLASSES = {
  sm: 'min-h-9 px-4.5 py-1.5 text-sm',
  md: 'min-h-10.5 px-4.5 py-2 text-sm',
  lg: 'min-h-12 px-5.5 py-2.5 text-[15px]',
  xl: 'min-h-12.5 px-5.5 py-3 text-[15px]',
  hero: 'min-h-14 px-7 py-3.5 text-base',
} as const;

/** The pill-shaped call to action every page uses. */
export const linkButtonClass = (tone: keyof typeof TONE_CLASSES, size: keyof typeof SIZE_CLASSES) =>
  cn(
    'ff-ui inline-flex items-center justify-center rounded-full text-center leading-[1.15] font-medium transition-transform duration-150',
    'hover:no-underline hover:brightness-[1.06] active:scale-[.97]',
    TONE_CLASSES[tone],
    SIZE_CLASSES[size],
  );

interface LinkButtonProps extends ComponentProps<typeof Link> {
  tone: keyof typeof TONE_CLASSES;
  size: keyof typeof SIZE_CLASSES;
}

export function LinkButton({ tone, size, className, ...props }: LinkButtonProps) {
  return <Link className={cn(linkButtonClass(tone, size), className)} {...props} />;
}
