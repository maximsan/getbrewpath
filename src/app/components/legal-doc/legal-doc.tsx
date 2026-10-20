import { getFormatter, getMessages, getTranslations } from 'next-intl/server';

import { pageTitleClass } from '@components/section/section';
import { pageMetadata } from '@domains/site/page-metadata';
import { PAGE_ROUTES } from '@domains/site/routes';
import { LEGAL_DOCS, type LegalDocId } from '@domains/site/legal-docs';
import { PHONE } from '@domains/site/site';
import { type LocaleParams, setPageLocale } from '@i18n/page-locale';
import { TWO_DIGITS } from '@shared/format/number';

/** One piece of a section, as the document lays it out. */
type Block =
  | { p: string }
  | { h: string }
  | { list: Record<string, string> }
  | { lines: Record<string, string> };

const paragraphClass = 'ff-ui mt-0 mb-3.5 text-base leading-[1.7] text-pretty text-ink';

/**
 * The Terms of Use or Privacy Policy, word for word from its file in `public/legal/`:
 * title, date, sticky contents and numbered sections.
 */
export async function LegalDoc({ doc }: { doc: LegalDocId }) {
  const t = await getTranslations('docs');
  const format = await getFormatter();
  const { docs } = await getMessages();
  const source = LEGAL_DOCS[doc];
  const sections = Object.entries(docs[doc].sections);
  const intro = Object.keys(docs[doc].intro);
  type TextKey = Parameters<typeof t>[0];
  /** The text at `path` inside this doc. Paths are read from the doc's own messages, which TypeScript cannot follow. */
  const text = (path: string) =>
    t(`${doc}.${path}` as TextKey, { email: source.email, phone: PHONE });
  const anchor = (key: string) => `doc-${key}`;
  const date = format.dateTime(new Date(source.date), { dateStyle: 'long', timeZone: 'UTC' });

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
        {intro.map((paragraph, index) => (
          <p
            key={paragraph}
            className={`ff-ui mb-0 text-[17px] leading-[1.6] text-pretty text-ink-mute ${index === 0 ? 'mt-[22px]' : 'mt-3.5'}`}
          >
            {text(`intro.${paragraph}`)}
          </p>
        ))}
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
              {Object.entries(section.blocks as Record<string, Block>).map(([id, block]) => (
                <SectionBlock
                  key={id}
                  block={block}
                  path={`sections.${key}.blocks.${id}`}
                  text={text}
                />
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

interface SectionBlockProps {
  block: Block;
  /** Where the block sits in the doc's messages, e.g. "sections.s1.blocks.b2". */
  path: string;
  text: (path: string) => string;
}

function SectionBlock({ block, path, text }: SectionBlockProps) {
  if ('h' in block) {
    return (
      <h3 className="ff-ui mt-6 mb-2.5 text-base font-semibold text-ink">{text(`${path}.h`)}</h3>
    );
  }
  if ('list' in block) {
    return (
      <ul className={`${paragraphClass} list-disc ps-5`}>
        {Object.keys(block.list).map((item) => (
          <li key={item}>{text(`${path}.list.${item}`)}</li>
        ))}
      </ul>
    );
  }
  if ('lines' in block) {
    return (
      <address className={`${paragraphClass} not-italic`}>
        {Object.keys(block.lines).map((line) => (
          <span key={line} className="block">
            {text(`${path}.lines.${line}`)}
          </span>
        ))}
      </address>
    );
  }
  return <p className={paragraphClass}>{text(`${path}.p`)}</p>;
}

/** The Terms of Use or Privacy Policy page's title, description and address. */
export async function legalDocMetadata(doc: LegalDocId, params: LocaleParams['params']) {
  const locale = await setPageLocale(params);
  const t = await getTranslations({ locale, namespace: `docs.${doc}` });
  return pageMetadata({
    locale,
    title: t('title'),
    description: t('intro.p1'),
    path: PAGE_ROUTES[doc],
  });
}
