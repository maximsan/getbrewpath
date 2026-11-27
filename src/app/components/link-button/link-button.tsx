import { useTranslations } from 'next-intl';
import type { ComponentProps } from 'react';

import { APP_STORE_LIVE, APP_STORE_URL } from '@domains/site/site';
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

/** The pill shape that the buttons and the coming-soon label share. */
const PILL_CLASS =
  'ff-ui inline-flex items-center justify-center rounded-full text-center leading-[1.15] font-medium';

/** The pill-shaped call to action every page uses. */
export const linkButtonClass = (tone: keyof typeof TONE_CLASSES, size: keyof typeof SIZE_CLASSES) =>
  cn(
    PILL_CLASS,
    'transition-transform duration-150',
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

/**
 * The App Store download button. Before launch (`APP_STORE_LIVE` is false) it
 * shows a "Coming soon" label instead, in the same size, and ignores `tone`
 * and `children`.
 */
export function AppDownloadLink({
  children,
  className,
  size,
  ...props
}: Omit<LinkButtonProps, 'href'>) {
  const translate = useTranslations('availability');

  if (!APP_STORE_LIVE) {
    return (
      <span
        className={cn(PILL_CLASS, 'gap-2 bg-accent/10 text-accent', SIZE_CLASSES[size], className)}
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
        {translate('comingSoon')}
      </span>
    );
  }

  return (
    <LinkButton {...props} size={size} className={className} href={APP_STORE_URL}>
      {children}
    </LinkButton>
  );
}
