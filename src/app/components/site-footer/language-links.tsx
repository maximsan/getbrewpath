'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname } from '@i18n/navigation';
import { LOCALE_NAMES, routing } from '@i18n/routing';

/** Links to this page in the site's other languages; absent while the site has one. */
export function LanguageLinks() {
  const t = useTranslations('nav');
  const current = useLocale();
  const pathname = usePathname();
  const others = routing.locales.filter((locale) => locale !== current);
  if (others.length === 0) return null;

  return (
    <nav aria-label={t('languages')} className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {others.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          lang={locale}
          className="ff-ui text-sm leading-[1.2] text-ink-mute transition-colors hover:text-ink hover:no-underline"
        >
          {LOCALE_NAMES[locale]}
        </Link>
      ))}
    </nav>
  );
}
