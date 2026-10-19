/**
 * A fixed-window counter per key, kept in this server instance's memory. On
 * serverless hosting each instance counts on its own, so it slows a single
 * sender down rather than enforcing an exact global limit.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const windows = new Map<string, { startedAt: number; count: number }>();

  return function allow(key: string, now = Date.now()): boolean {
    for (const [storedKey, window] of windows) {
      if (now - window.startedAt >= windowMs) windows.delete(storedKey);
    }
    const window = windows.get(key);
    if (!window) {
      windows.set(key, { startedAt: now, count: 1 });
      return true;
    }
    window.count += 1;
    return window.count <= limit;
  };
}
