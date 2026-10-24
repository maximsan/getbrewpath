import type { ComponentProps } from 'react';

import { cn } from '@shared/styles/cn';

/**
 * Two or more buttons side by side. On a phone each one takes the row's full width,
 * so they stack as equal bars.
 */
export function ButtonRow({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-wrap gap-3 max-tablet:*:flex-[1_1_100%]', className)}
      {...props}
    />
  );
}
