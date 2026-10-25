import type { ReactNode } from 'react';

/** Each route change fades the new page up, as the prototype's page switch does. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
