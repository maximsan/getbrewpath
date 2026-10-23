'use client';

import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import { type MouseEvent, useEffect, useId, useRef, useState } from 'react';

import { LinkButton } from '@components/link-button/link-button';
import { MoodSwitch } from '@components/mood/mood-switch';
import { LEGAL_PAGES, PAGE_ROUTES } from '@domains/site/routes';
import { APP_STORE_URL, MAILTO_HI } from '@domains/site/site';
import { Link, usePathname } from '@i18n/navigation';
import { TWO_DIGITS } from '@shared/format/number';
import { cn } from '@shared/styles/cn';

import { NAV_SECTIONS, sectionHref } from './nav-items';

/** From this width the section links sit in the header and the menu closes. Matches `min-[980px]` below. */
const WIDE_SCREEN = '(min-width: 980px)';
/** Seconds before the first menu link slides in. */
const FIRST_LINK_DELAY = 0.08;
/** Seconds between one menu link's slide-in and the next one's. */
const LINK_STAGGER = 0.06;

/** The slide-in delay of the menu item at `index`, as a CSS `animation-delay`. */
function menuItemDelay(index: number) {
  return { animationDelay: `${FIRST_LINK_DELAY + index * LINK_STAGGER}s` };
}

const menuSmallLinkClass = 'ff-ui text-sm text-ink-mute hover:text-ink hover:no-underline';

/**
 * Sticky top bar: brand, section links, mood switch and the store link.
 * Below 980px the links move into a menu that covers the page under the bar.
 * While it is open the page behind it does not scroll, and Escape closes it.
 * Below 375px the brand shows only its icon, so the bar fits the screen.
 */
export function SiteHeader() {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const brand = useTranslations()('brand');
  const format = useFormatter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);

  // Any page change closes the menu, including one from a footer link.
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const wide = window.matchMedia(WIDE_SCREEN);
    const closeWhenWide = () => {
      if (wide.matches) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    document.body.style.overflow = 'hidden';
    wide.addEventListener('change', closeWhenWide);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      wide.removeEventListener('change', closeWhenWide);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const goHomeTop = (event: MouseEvent) => {
    closeMenu();
    if (pathname !== '/') return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
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
            <span
              translate="no"
              className="ff-display text-[22px] leading-none tracking-[-0.02em] max-[375px]:sr-only"
            >
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
            className="hidden flex-none min-[980px]:inline-flex"
          >
            {t('getApp')}
          </LinkButton>
          <button
            ref={menuButton}
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
      </header>
      {/* Rendered outside the header. The header blurs what is behind it, which makes the browser
          place a fixed-position child against the header, not the screen. */}
      {menuOpen && (
        <div
          id={menuId}
          className="fixed inset-x-0 top-16 bottom-0 z-40 animate-menu-fade overflow-auto bg-bg min-[980px]:hidden"
        >
          <nav
            aria-label={t('primary')}
            className="page-width box-border flex min-h-full flex-col px-4 pt-5 pb-8 min-[600px]:px-6"
          >
            {NAV_SECTIONS.map((section, index) => (
              <Link
                key={section.id}
                href={sectionHref(section.id)}
                onClick={closeMenu}
                style={menuItemDelay(index)}
                className="ff-display flex min-h-[68px] animate-menu-link items-baseline gap-[18px] py-[18px] text-[clamp(30px,8vw,44px)] leading-[1.05] tracking-[-0.02em] text-ink hover:no-underline"
              >
                <span className="ff-mono flex-none text-[11px] tracking-[.14em] text-ink-mute">
                  {format.number(index + 1, TWO_DIGITS)}
                </span>
                {t(section.label)}
              </Link>
            ))}
            <div className="flex-1" />
            <div
              style={menuItemDelay(NAV_SECTIONS.length)}
              className="mt-10 flex animate-menu-link flex-col gap-[22px]"
            >
              <LinkButton href={APP_STORE_URL} tone="accent" size="hero" className="flex">
                {t('getApp')}
              </LinkButton>
              <div className="flex flex-wrap justify-center gap-x-[22px] gap-y-2.5">
                <a href={MAILTO_HI} className={menuSmallLinkClass}>
                  {tFooter('support')}
                </a>
                {LEGAL_PAGES.map((page) => (
                  <Link
                    key={page}
                    href={PAGE_ROUTES[page]}
                    onClick={closeMenu}
                    className={menuSmallLinkClass}
                  >
                    {tFooter(page)}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
