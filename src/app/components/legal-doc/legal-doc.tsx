import { getFormatter, getMessages, getTranslations } from 'next-intl/server';

import { pageTitleClass } from '@components/section/section';
import { pageMetadata } from '@domains/site/page-metadata';
import { PAGE_ROUTES } from '@domains/site/routes';
import { LEGAL_DOC_DATE_FORMAT, LEGAL_DOCS, type LegalDocId } from '@domains/site/legal-docs';
import { PHONE } from '@domains/site/site';
import { type LocaleParams, setPageLocale } from '@i18n/page-locale';
import { TWO_DIGITS } from '@shared/format/number';

import { legalDocOutline, type OutlineBlock } from './legal-doc-outline';

const paragraphClass = 'ff-ui mt-0 mb-3.5 text-base leading-[1.7] text-pretty text-ink';

/**
 * The Terms of Use or Privacy Policy, word for word from its file in `public/legal/`:
 * title, date, a table of contents that stays on screen while scrolling, and numbered sections.
 */
export async function LegalDoc({ doc }: { doc: LegalDocId }) {
  const t = await getTranslations('docs');
  const format = await getFormatter();
  const { docs } = await getMessages();
  const source = LEGAL_DOCS[doc];
  const { introKeys, sections } = legalDocOutline(docs[doc]);
  type TextKey = Parameters<typeof t>[0];
  /** The text at `key` inside this document. The key is built at run time, so TypeScript cannot check it. */
  const text = (key: string) =>
    t(`${doc}.${key}` as TextKey, { email: source.email, phone: PHONE });
  const anchor = (sectionId: string) => `doc-${sectionId}`;
  const date = format.dateTime(new Date(source.date), LEGAL_DOC_DATE_FORMAT);

  return (
    <section className="mx-auto max-w-[1000px] px-6 pt-[clamp(40px,6vw,72px)]">
      <div className="max-w-[720px]">
        <h1 className={pageTitleClass}>{t(`${doc}.title`)}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-[18px] gap-y-2.5">
          <span className="ff-mono text-[11px] tracking-[.1em] text-ink-mute uppercase">
            {t(`${doc}.dated`, { date })}
          </span>
          <a href={source.file} download className="ff-ui text-sm font-medium">
            {t('download')}
          </a>
        </div>
        <div className="mt-[22px] space-y-3.5">
          {introKeys.map((key) => (
            <p key={key} className="ff-ui m-0 text-[17px] leading-[1.6] text-pretty text-ink-mute">
              {text(key)}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-14 grid items-start gap-12 min-[980px]:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-labelledby="doc-contents"
          className="sticky top-[88px] hidden flex-col gap-0.5 min-[980px]:flex"
        >
          <div id="doc-contents" className="smallcaps mb-2.5">
            {t('contents')}
          </div>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${anchor(section.id)}`}
              className="ff-ui block border-s border-rule py-[7px] ps-3.5 text-sm leading-[1.3] text-ink-mute"
            >
              {text(section.headingKey)}
            </a>
          ))}
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
                <SectionBlock key={block.id} block={block} text={text} />
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-6">
            <span className="ff-ui text-sm text-ink-mute">{t('questions')}</span>
            <a href={`mailto:${source.email}`} translate="no" className="ff-ui text-sm font-medium">
              {source.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionBlock({ block, text }: { block: OutlineBlock; text: (key: string) => string }) {
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

/** The Terms of Use or Privacy Policy page's title, description and address. */
export async function legalDocMetadata(doc: LegalDocId, params: LocaleParams['params']) {
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
