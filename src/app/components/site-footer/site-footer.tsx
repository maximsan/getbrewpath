import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import appIcon from '@assets/app-icon.png';
import { LEGAL_PAGES, PAGE_ROUTES } from '@domains/site/routes';
import { COPYRIGHT_YEAR, MAILTO_HI } from '@domains/site/site';
import { Link } from '@i18n/navigation';

import { LanguageLinks } from './language-links';

const footerLinkClass =
  'ff-ui text-sm leading-[1.2] text-ink-mute transition-colors hover:text-ink hover:no-underline';

export async function SiteFooter() {
  const translate = await getTranslations('footer');
  const tRoot = await getTranslations();

  return (
    <footer className="mt-[clamp(64px,9vw,120px)] border-t border-rule">
      <div className="page-width flex flex-col items-center gap-y-6 px-6 pt-9 pb-11 tablet:flex-row tablet:flex-wrap tablet:justify-between tablet:gap-x-10">
        <div className="flex flex-wrap items-center gap-x-4.5 gap-y-3 max-[600px]:justify-center">
          <div className="flex items-center gap-2.5">
            <Image src={appIcon} alt="" width={28} height={28} className="block rounded-[7px]" />
            <span translate="no" className="ff-display text-xl leading-none tracking-[-0.02em]">
              {tRoot('brand')}
            </span>
          </div>
          <span className="ff-mono text-[11px] leading-none tracking-widest text-ink-mute uppercase">
            {translate('copyright', { year: String(COPYRIGHT_YEAR) })}
          </span>
        </div>
        <nav
          aria-label={tRoot('nav.footer')}
          className="flex flex-wrap items-center gap-x-6 gap-y-3 max-[600px]:justify-center"
        >
          {LEGAL_PAGES.map((page) => (
            <Link key={page} href={PAGE_ROUTES[page]} className={footerLinkClass}>
              {translate(page)}
            </Link>
          ))}
          <a href={MAILTO_HI} className={footerLinkClass}>
            {translate('support')}
          </a>
        </nav>
        <LanguageLinks />
      </div>
    </footer>
  );
}
