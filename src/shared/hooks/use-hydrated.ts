import { useSyncExternalStore } from 'react';

const subscribeNever = () => () => {};

/**
 * false on the server and during hydration, true after it. Code that depends on
 * the browser renders the same HTML as the server first, so hydration never fails.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}
