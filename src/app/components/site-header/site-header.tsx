'use client';

import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import { type MouseEvent, useEffect, useId, useRef, useState } from 'react';

import { LinkButton } from '@components/link-button/link-button';
import { MoodSwitch } from '@components/mood/mood-switch';
import { LEGAL_PAGES, PAGE_ROUTES } from '@domains/site/routes';
import { APP_STORE_URL, MAILTO_HI } from '@domains/site/site';
import { Link, usePathname, useRouter } from '@i18n/navigation';
import { TWO_DIGITS } from '@shared/format/number';
import { cn } from '@shared/styles/cn';
import type { CssVariables } from '@shared/styles/css-variables';

import { NAV_SECTIONS, type NavSectionId, sectionHref } from './nav-items';
import { RoastProgress } from './roast-progress';

/** From this width the section links sit in the header and the menu closes. Matches `min-[980px]` below. */
const WIDE_SCREEN = '(min-width: 980px)';
/** Seconds before the first menu link slides in. */
const FIRST_LINK_DELAY = 0.08;
/** Seconds between one menu link's slide-in and the next one's. */
const LINK_STAGGER = 0.06;
/** How long a tapped menu link shows as pressed before the menu closes. */
const PRESSED_MS = 220;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** The slide-in delay of the menu item at `index`, for its animation to read. */
function menuItemDelay(index: number): CssVariables {
  return { '--start-delay': `${FIRST_LINK_DELAY + index * LINK_STAGGER}s` };
}

const menuSmallLinkClass = 'ff-ui text-sm text-ink-mute hover:text-ink hover:no-underline';

/**
 * Sticky top bar: brand, section links, mood switch and the store link.
 * Below 980px the links move into a menu that covers the page under the bar.
 * While it is open the page behind it does not scroll, and Escape closes it.
 * Below 375px the brand shows only its icon, so the bar fits the screen.
 */
export function SiteHeader() {
  const translate = useTranslations('nav');
  const translateFooter = useTranslations('footer');
  const brand = useTranslations()('brand');
  const format = useFormatter();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pressedSection, setPressedSection] = useState<NavSectionId | null>(null);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Any page change closes the menu, including one from a footer link.
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const wide = window.matchMedia(WIDE_SCREEN);
    const closeWhenWide = () => {
      if (wide.matches) {
        setMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
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
      // A menu closed some other way mid-press must not still jump to the pressed section.
      clearTimeout(pressTimer.current);
      setPressedSection(null);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  /**
   * A tapped menu link shows as pressed for a moment, then the menu closes and the page
   * scrolls to the section. A click that opens a new tab, or a visitor who asked for less
   * motion, gets the link straight away.
   */
  const openSection = (event: MouseEvent, sectionId: NavSectionId) => {
    const opensNewTab = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    if (opensNewTab || window.matchMedia(REDUCED_MOTION).matches) {
      closeMenu();

      return;
    }

    event.preventDefault();

    if (pressedSection) {
      return;
    }

    setPressedSection(sectionId);
    pressTimer.current = setTimeout(() => {
      closeMenu();
      router.push(sectionHref(sectionId));
    }, PRESSED_MS);
  };

  const goHomeTop = (event: MouseEvent) => {
    closeMenu();
    if (pathname !== '/') {
      return;
    }
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-rule bg-bg">
        <div className="page-width flex min-h-16 items-center gap-2.5 px-4 tablet:gap-5 tablet:px-6">
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
            aria-label={translate('primary')}
            className="ms-6 hidden flex-wrap items-center gap-x-[26px] gap-y-2 min-[980px]:flex"
          >
            {NAV_SECTIONS.map((section) => (
              <Link
                key={section.id}
                href={sectionHref(section.id)}
                className="ff-ui text-sm leading-[1.2] font-medium text-ink-mute transition-colors hover:text-ink hover:no-underline"
              >
                {translate(section.label)}
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
            {translate('getApp')}
          </LinkButton>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={translate('menu')}
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
                menuOpen && 'translate-y-[-3.25px] -rotate-45',
              )}
            />
          </button>
        </div>
        {pathname === PAGE_ROUTES.home && <RoastProgress />}
      </header>
      {menuOpen && (
        <div
          id={menuId}
          className="fixed inset-x-0 top-16 bottom-0 z-40 animate-menu-fade overflow-auto bg-bg min-[980px]:hidden"
        >
          <nav
            aria-label={translate('primary')}
            className="page-width box-border flex min-h-full flex-col px-4 pt-5 pb-8 tablet:px-6"
          >
            {/* The links sit a little above the middle of the space the store button leaves. */}
            <div className="flex-1" />
            {NAV_SECTIONS.map((section, index) => (
              // The wrapper slides in; the link inside moves on its own when pressed.
              <div key={section.id} style={menuItemDelay(index)} className="animate-menu-link">
                <Link
                  href={sectionHref(section.id)}
                  onClick={(event) => openSection(event, section.id)}
                  data-pressed={pressedSection === section.id || undefined}
                  className="group ff-display flex origin-left items-start gap-[18px] py-[clamp(8px,1.6vh,14px)] text-[clamp(34px,7vw,56px)] leading-none tracking-[-0.02em] text-ink transition-[color,transform] duration-200 ease-soft hover:no-underline active:translate-x-2 active:text-accent data-pressed:translate-x-2 data-pressed:text-accent [@media(hover:hover)]:hover:translate-x-2 [@media(hover:hover)]:hover:text-accent"
                >
                  <span className="ff-mono mt-[.22em] flex-none text-xs leading-none tracking-[.14em] text-ink-mute transition-colors duration-200 group-hover:text-accent group-active:text-accent group-data-pressed:text-accent">
                    {format.number(index + 1, TWO_DIGITS)}
                  </span>
                  {translate(section.label)}
                </Link>
              </div>
            ))}
            <div className="flex-[1.4]" />
            <div
              style={menuItemDelay(NAV_SECTIONS.length)}
              className="mt-10 flex animate-menu-link flex-col gap-[22px]"
            >
              <LinkButton
                href={APP_STORE_URL}
                tone="accent"
                size="hero"
                className="mx-auto flex w-full max-w-[360px]"
              >
                {translate('getApp')}
              </LinkButton>
              <div className="flex flex-wrap justify-center gap-x-[22px] gap-y-2.5">
                <a href={MAILTO_HI} className={menuSmallLinkClass}>
                  {translateFooter('support')}
                </a>
                {LEGAL_PAGES.map((page) => (
                  <Link
                    key={page}
                    href={PAGE_ROUTES[page]}
                    onClick={closeMenu}
                    className={menuSmallLinkClass}
                  >
                    {translateFooter(page)}
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
