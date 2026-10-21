import { getFormatter, getMessages, getTranslations } from 'next-intl/server';

import { pageTitleClass } from '@components/section/section';
import { pageMetadata } from '@domains/site/page-metadata';
import { PAGE_ROUTES } from '@domains/site/routes';
import { EMAIL_HELLO, LEGAL_DOCS_UPDATED, SELLING_MODEL } from '@domains/site/site';
import { type LocaleParams, setPageLocale } from '@i18n/page-locale';
import { TWO_DIGITS } from '@shared/format/number';

export type LegalDocId = 'terms' | 'privacy';

/** The Terms of Use or Privacy Policy: title, draft note, sticky contents and numbered sections. */
export async function LegalDoc({ doc }: { doc: LegalDocId }) {
  const t = await getTranslations('docs');
  const format = await getFormatter();
  const { docs } = await getMessages();
  const sections = Object.entries(docs[doc].sections);
  type ParagraphKey = Parameters<typeof t>[0];
  const anchor = (key: string) => `doc-${key}`;
  const updated = format.dateTime(new Date(LEGAL_DOCS_UPDATED), {
    dateStyle: 'long',
    timeZone: 'UTC',
  });

  return (
    <section className="mx-auto max-w-[1000px] px-6 pt-[clamp(40px,6vw,72px)]">
      <div className="max-w-[720px]">
        <h1 className={pageTitleClass}>{t(`${doc}.title`)}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-[18px] gap-y-2.5">
          <span className="ff-mono text-[11px] tracking-[.1em] text-ink-mute uppercase">
            {t('updated', { date: updated })}
          </span>
          <span className="ff-mono rounded-full border border-dashed border-[color-mix(in_oklab,var(--warn)_50%,var(--rule))] px-2.5 py-[5px] text-[11px] tracking-[.1em] text-warn uppercase">
            {t('draft')}
          </span>
        </div>
        <p className="ff-ui mt-[22px] mb-0 text-[17px] leading-[1.6] text-pretty text-ink-mute">
          {t(`${doc}.intro`)}
        </p>
      </div>
      <div className="mt-14 grid items-start gap-12 min-[980px]:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-labelledby="doc-contents"
          className="sticky top-[88px] hidden flex-col gap-0.5 min-[980px]:flex"
        >
          <div id="doc-contents" className="smallcaps mb-2.5">
            {t('contents')}
          </div>
          {sections.map(([key, section]) => (
            <a
              key={key}
              href={`#${anchor(key)}`}
              className="ff-ui block border-s border-rule py-[7px] ps-3.5 text-sm leading-[1.3] text-ink-mute"
            >
              {section.h}
            </a>
          ))}
        </nav>
        <div className="max-w-[68ch] min-w-0">
          {sections.map(([key, section], index) => (
            <div key={key} id={anchor(key)} className="scroll-mt-[90px] pb-10">
              <div className="ff-mono mb-2 text-[11px] tracking-[.14em] text-accent uppercase">
                {format.number(index + 1, TWO_DIGITS)}
              </div>
              <h2 className="ff-display m-0 mb-3.5 text-[26px] leading-[1.15] font-normal tracking-[-0.015em]">
                {section.h}
              </h2>
              {Object.keys(section.ps).map((paragraph) => (
                <p
                  key={paragraph}
                  className="ff-ui mt-0 mb-3.5 text-base leading-[1.7] text-pretty text-ink"
                >
                  {/* The key is read from this doc's own sections, which TypeScript cannot follow. */}
                  {t(`${doc}.sections.${key}.ps.${paragraph}` as ParagraphKey, {
                    email: EMAIL_HELLO,
                    model: SELLING_MODEL,
                  })}
                </p>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-6">
            <span className="ff-ui text-sm text-ink-mute">{t('questions')}</span>
            <a href={`mailto:${EMAIL_HELLO}`} translate="no" className="ff-ui text-sm font-medium">
              {EMAIL_HELLO}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The Terms of Use or Privacy Policy page's title, description and address. */
export async function legalDocMetadata(doc: LegalDocId, params: LocaleParams['params']) {
  const locale = await setPageLocale(params);
  const t = await getTranslations({ locale, namespace: `docs.${doc}` });
  return pageMetadata({
    locale,
    title: t('title'),
    description: t('intro'),
    path: PAGE_ROUTES[doc],
  });
}
