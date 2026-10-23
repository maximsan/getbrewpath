import { getFormatter, getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { DownloadIcon } from '@components/icons/icons';
import { linkButtonClass } from '@components/link-button/link-button';
import { pageTitleClass } from '@components/section/section';
import { pageMetadata } from '@domains/site/page-metadata';
import { PAGE_ROUTES } from '@domains/site/routes';
import { LEGAL_DOC_DATE_FORMAT } from '@domains/site/legal-docs';
import { type LegalPageName, legalPageSource } from '@domains/site/legal-pages';
import { mailtoHref, PHONE } from '@domains/site/site';
import { Link } from '@i18n/navigation';
import { type LocaleParams, setPageLocale } from '@i18n/page-locale';
import { TWO_DIGITS } from '@shared/format/number';
import { cn } from '@shared/styles/cn';

import { legalDocOutline, type OutlineBlock } from './legal-doc-outline';

const paragraphClass = 'ff-ui mt-0 mb-3.5 text-base leading-[1.7] text-pretty text-ink';

/**
 * A legal page: title, date, a table of contents and numbered sections.
 * The Terms of Use and the Privacy Policy copy their PDF in `public/legal/` word for word,
 * and offer it for download. The website privacy page has no PDF.
 * On wide screens the table of contents stays on screen while scrolling.
 */
export async function LegalDoc({ doc }: { doc: LegalPageName }) {
  const t = await getTranslations('docs');
  const format = await getFormatter();
  const { docs } = await getMessages();
  const source = legalPageSource(doc);
  const { introKeys, sections } = legalDocOutline(docs[doc]);
  type TextKey = Parameters<typeof t>[0];
  const values = { email: source.email, phone: PHONE };
  /** The text at `key` inside this document. The key is built at run time, so TypeScript cannot check it. */
  const text = (key: string) => t(`${doc}.${key}` as TextKey, values);
  /**
   * Like `text`, for the section blocks: there a `<policy>` tag becomes a link to the app's
   * Privacy Policy. The website privacy page uses it. Titles and headings take no tags.
   */
  const richText = (key: string) =>
    t.rich(`${doc}.${key}` as TextKey, {
      ...values,
      policy: (chunks) => <Link href={PAGE_ROUTES.privacy}>{chunks}</Link>,
    });
  const anchor = (sectionId: string) => `doc-${sectionId}`;
  const date = format.dateTime(new Date(source.date), LEGAL_DOC_DATE_FORMAT);

  return (
    <section className="mx-auto max-w-[768px] px-6 pt-[clamp(40px,6vw,72px)] min-[980px]:max-w-[1000px]">
      <div className="max-w-[720px]">
        <h1 className={pageTitleClass}>{t(`${doc}.title`)}</h1>
        <div className="ff-mono mt-5 text-[11px] tracking-[.1em] text-ink-mute uppercase">
          {t(`${doc}.dated`, { date })}
        </div>
        <div className="mt-[22px] space-y-3.5">
          {introKeys.map((key) => (
            <p key={key} className="ff-ui m-0 text-[17px] leading-[1.6] text-pretty text-ink-mute">
              {text(key)}
            </p>
          ))}
        </div>
        {source.file && (
          <a
            href={source.file}
            download
            className={cn(linkButtonClass('outline', 'lg'), 'mt-[26px] gap-2')}
          >
            <DownloadIcon size={16} />
            {t('download')}
          </a>
        )}
      </div>
      <div className="mt-14 grid items-start gap-12 min-[980px]:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-labelledby="doc-contents"
          className="flex flex-col gap-0.5 min-[980px]:sticky min-[980px]:top-[88px]"
        >
          <div id="doc-contents" className="smallcaps mb-2.5">
            {t('contents')}
          </div>
          <div className="flex flex-wrap gap-2 min-[980px]:flex-col min-[980px]:gap-0.5">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${anchor(section.id)}`}
                className="ff-ui block rounded-full border border-rule px-3.5 py-2 text-sm leading-[1.3] text-ink-mute min-[980px]:rounded-none min-[980px]:border-0 min-[980px]:border-s min-[980px]:py-[7px] min-[980px]:pe-0"
              >
                {text(section.headingKey)}
              </a>
            ))}
          </div>
        </nav>
        <div className="max-w-[68ch] min-w-0">
          {sections.map((section, index) => (
            <div key={section.id} id={anchor(section.id)} className="scroll-mt-[90px] pb-10">
              <div className="ff-mono mb-2 text-[11px] tracking-[.14em] text-accent uppercase">
                {format.number(index + 1, TWO_DIGITS)}
              </div>
              <h2 className="ff-display m-0 mb-3.5 text-[26px] leading-[1.15] font-normal tracking-[-0.015em]">
                {text(section.headingKey)}
              </h2>
              {section.blocks.map((block) => (
                <SectionBlock key={block.id} block={block} text={richText} />
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-6">
            <span className="ff-ui text-sm text-ink-mute">{t('questions')}</span>
            <a href={mailtoHref(source.email)} translate="no" className="ff-ui text-sm font-medium">
              {source.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionBlock({ block, text }: { block: OutlineBlock; text: (key: string) => ReactNode }) {
  const texts = block.textKeys.map((key) => ({ key, text: text(key) }));
  switch (block.kind) {
    case 'h':
      return (
        <h3 className="ff-ui mt-6 mb-2.5 text-base font-semibold text-ink">{texts[0]?.text}</h3>
      );
    case 'list':
      return (
        <ul className={`${paragraphClass} list-disc ps-5`}>
          {texts.map((item) => (
            <li key={item.key}>{item.text}</li>
          ))}
        </ul>
      );
    case 'lines':
      return (
        <p translate="no" className={paragraphClass}>
          {texts.map((line) => (
            <span key={line.key} className="block">
              {line.text}
            </span>
          ))}
        </p>
      );
    case 'p':
      return <p className={paragraphClass}>{texts[0]?.text}</p>;
  }
}

/** A legal document page's title, description and address. */
export async function legalDocMetadata(doc: LegalPageName, params: LocaleParams['params']) {
  const locale = await setPageLocale(params);
  const t = await getTranslations({ locale, namespace: `docs.${doc}` });
  const { docs } = await getMessages({ locale });
  const [firstParagraph = ''] = legalDocOutline(docs[doc]).introKeys;
  return pageMetadata({
    locale,
    title: t('title'),
    // The key is built at run time, so TypeScript cannot check it.
    description: t(firstParagraph as Parameters<typeof t>[0]),
    path: PAGE_ROUTES[doc],
  });
}
