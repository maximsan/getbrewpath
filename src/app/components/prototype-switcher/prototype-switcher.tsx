'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * PROTOTYPE ONLY. A floating bar that flips between variants of a page through
 * the `?variant=` search param. Hidden in production builds.
 */
export function PrototypeSwitcher({
  variants,
}: {
  variants: ReadonlyArray<{ key: string; name: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentKey = searchParams.get('variant') ?? variants[0]?.key;
  const index = Math.max(
    0,
    variants.findIndex((variant) => variant.key === currentKey),
  );
  const current = variants[index];

  const go = (step: number) => {
    const next = variants[(index + step + variants.length) % variants.length];
    if (next) router.replace(`?variant=${next.key}`, { scroll: false });
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable]')) return;
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (process.env.NODE_ENV === 'production' || !current) return null;

  return (
    <div className="ff-ui fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-full bg-black px-4 py-2 text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,.35)]">
      <button type="button" onClick={() => go(-1)} aria-label="Previous variant">
        ←
      </button>
      <span>
        {current.key} ({current.name})
      </span>
      <button type="button" onClick={() => go(1)} aria-label="Next variant">
        →
      </button>
    </div>
  );
}
