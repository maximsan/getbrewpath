import type { ReactNode } from 'react';

/** Each language's layout, `[locale]/layout.tsx`, renders the page; this one only lets `not-found.tsx` sit beside it. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
