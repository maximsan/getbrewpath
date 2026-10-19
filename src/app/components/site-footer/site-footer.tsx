import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { COPYRIGHT_YEAR } from '@domains/site/site';

const FOOTER_LINKS = [
  { href: '/terms', label: 'terms' },
  { href: '/privacy', label: 'privacy' },
  { href: '/support', label: 'support' },
  { href: '/press', label: 'press' },
] as const;

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const tRoot = await getTranslations();

  return (
    <footer className="mt-[clamp(64px,9vw,120px)] border-t border-rule">
      <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-x-10 gap-y-6 px-6 pt-9 pb-11">
        <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/app-icon.png"
              alt=""
              width={28}
              height={28}
              className="block rounded-[7px]"
            />
            <span translate="no" className="ff-display text-xl leading-none tracking-[-0.02em]">
              {tRoot('brand')}
            </span>
          </div>
          <span className="ff-mono text-[11px] leading-none tracking-[.1em] text-ink-mute uppercase">
            {t('copyright', { year: String(COPYRIGHT_YEAR) })}
          </span>
        </div>
        <nav
          aria-label={tRoot('nav.footer')}
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="ff-ui text-sm leading-[1.2] text-ink-mute transition-colors hover:text-ink hover:no-underline"
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
