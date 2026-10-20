'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type MouseEvent, useId, useState } from 'react';

import { LinkButton } from '@components/link-button/link-button';
import { MoodSwitch } from '@components/mood/mood-switch';
import { APP_STORE_URL } from '@domains/site/site';
import { Link, usePathname } from '@i18n/navigation';
import { cn } from '@shared/styles/cn';

import { NAV_SECTIONS, sectionHref } from './nav-items';

/**
 * Sticky top bar: brand, section links, mood switch and the store link.
 * Below 980px the links move into a menu that overlays the page, so opening
 * or closing it never shifts the content a link has just scrolled to.
 */
export function SiteHeader() {
  const t = useTranslations('nav');
  const brand = useTranslations()('brand');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const menuId = useId();

  // Any page change closes the menu, including one from a footer link.
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  const goHomeTop = (event: MouseEvent) => {
    setMenuOpen(false);
    if (pathname !== '/') return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] backdrop-blur-[14px]">
      <div className="page-width flex min-h-16 items-center gap-2.5 px-4 min-[600px]:gap-5 min-[600px]:px-6">
        <Link
          href="/"
          onClick={goHomeTop}
          className="flex flex-none items-center gap-2.5 text-ink hover:no-underline"
        >
          <Image
            src="/images/app-icon.png"
            alt=""
            width={30}
            height={30}
            className="block rounded-lg"
            priority
          />
          <span translate="no" className="ff-display text-[22px] leading-none tracking-[-0.02em]">
            {brand}
          </span>
        </Link>
        <nav
          aria-label={t('primary')}
          className="ms-6 hidden flex-wrap items-center gap-x-[26px] gap-y-2 min-[980px]:flex"
        >
          {NAV_SECTIONS.map((section) => (
            <Link
              key={section.id}
              href={sectionHref(section.id)}
              className="ff-ui text-sm leading-[1.2] font-medium text-ink-mute transition-colors hover:text-ink hover:no-underline"
            >
              {t(section.label)}
            </Link>
          ))}
        </nav>
        <div className="flex-1" />
        <MoodSwitch />
        <LinkButton
          href={APP_STORE_URL}
          tone="accent"
          size="sm"
          className="hidden flex-none min-[600px]:inline-flex"
        >
          {t('getApp')}
        </LinkButton>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={t('menu')}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className="inline-flex size-9 flex-none flex-col items-center justify-center gap-[5px] rounded-full border border-rule bg-surface p-0 text-ink min-[980px]:hidden"
        >
          <span
            className={cn(
              'block h-[1.5px] w-3.5 rounded-sm bg-current transition-transform duration-300 ease-soft',
              menuOpen && 'translate-y-[3.25px] rotate-45',
            )}
          />
          <span
            className={cn(
              'block h-[1.5px] w-3.5 rounded-sm bg-current transition-transform duration-300 ease-soft',
              menuOpen && '-translate-y-[3.25px] -rotate-45',
            )}
          />
        </button>
      </div>
      {menuOpen && (
        <nav
          id={menuId}
          aria-label={t('primary')}
          className="absolute inset-x-0 top-full flex animate-menu-in flex-col border-y border-rule bg-bg px-4 pt-2 pb-5 min-[600px]:px-6 min-[980px]:hidden"
        >
          {NAV_SECTIONS.map((section, index) => (
            <Link
              key={section.id}
              href={sectionHref(section.id)}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'ff-ui flex min-h-12 items-center py-2.5 text-base font-medium text-ink hover:no-underline',
                index < NAV_SECTIONS.length - 1 && 'border-b border-rule',
              )}
            >
              {t(section.label)}
            </Link>
          ))}
          <LinkButton href={APP_STORE_URL} tone="accent" size="lg" className="mt-3 flex">
            {t('getApp')}
          </LinkButton>
        </nav>
      )}
    </header>
  );
}
