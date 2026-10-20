import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/** Links and paths that keep the visitor's language. Use these instead of `next/link` and `next/navigation`. */
export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation(routing);
