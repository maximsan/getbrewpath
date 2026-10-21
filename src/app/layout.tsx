import type { ReactNode } from 'react';

/**
 * Each language's pages use `[locale]/layout.tsx`. This root layout exists
 * only because Next.js needs one beside `not-found.tsx`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
