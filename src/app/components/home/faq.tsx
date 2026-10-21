import { getMessages, getTranslations } from 'next-intl/server';

import { Disclosure } from '@components/brewpath/disclosure/disclosure';
import { Section, sectionTitleClass } from '@components/section/section';
import { PAGE_ROUTES } from '@domains/site/routes';
import { SELLING_MODEL } from '@domains/site/site';
import { Link } from '@i18n/navigation';

export async function Faq() {
  const t = await getTranslations('faq');
  const { faq } = await getMessages();

  return (
    <Section id="faq">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-10">
        <div data-reveal>
          <h2 className={sectionTitleClass}>{t('title')}</h2>
          <p className="ff-ui mt-[18px] mb-0 max-w-[40ch] text-[15px] leading-[1.6] text-ink-mute">
            {t.rich('more', { link: (chunks) => <Link href={PAGE_ROUTES.support}>{chunks}</Link> })}
          </p>
        </div>
        <div data-reveal data-delay="1" className="border-t border-rule">
          {(Object.keys(faq.items) as (keyof typeof faq.items)[]).map((key) => (
            <Disclosure
              key={key}
              label={t(`items.${key}.q`)}
              glyph="plus"
              divider
              headerPad="20px 0"
            >
              <p className="ff-ui mt-0 mb-[18px] max-w-[60ch] text-[15px] leading-[1.65] text-pretty text-ink-mute">
                {t(`items.${key}.a`, { model: SELLING_MODEL })}
              </p>
            </Disclosure>
          ))}
        </div>
      </div>
    </Section>
  );
}
