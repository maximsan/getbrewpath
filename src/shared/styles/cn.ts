import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * The `--text-*` sizes in `globals.css`. tailwind-merge knows only Tailwind's own sizes; it
 * reads an unknown `text-body` as a colour, and a later `text-ink` then drops it.
 */
const TEXT_SIZES = [
  'hero',
  'display',
  'title',
  'subtitle',
  'heading',
  'lead',
  'body',
  'support',
  'label',
  'micro',
];

const twMerge = extendTailwindMerge({ extend: { theme: { text: TEXT_SIZES } } });

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
