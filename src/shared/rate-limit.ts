/**
 * A fixed-window counter per key, kept in this server instance's memory.
 * On serverless hosting each instance counts separately. The limiter slows
 * one sender down; it does not enforce an exact global limit.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const windows = new Map<string, { startedAt: number; count: number }>();

  return function allow(key: string, now = Date.now()): boolean {
    const window = windows.get(key);
    if (!window || now - window.startedAt >= windowMs) {
      windows.set(key, { startedAt: now, count: 1 });
      return true;
    }
    window.count += 1;
    return window.count <= limit;
  };
}
