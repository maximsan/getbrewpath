import { getMessages, getTranslations } from 'next-intl/server';

import { Disclosure } from '@components/brewpath/disclosure/disclosure';
import { Section, sectionTitleClass } from '@components/section/section';
import { EMAIL_SUPPORT, SELLING_MODEL } from '@domains/site/site';

export async function Faq() {
  const t = await getTranslations('faq');
  const { faq } = await getMessages();

  return (
    <Section id="faq">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-10">
        <div data-reveal>
          <h2 className={sectionTitleClass}>{t('title')}</h2>
          <p className="ff-ui mt-[18px] mb-0 max-w-[40ch] text-[15px] leading-[1.6] text-ink-mute">
            {t.rich('more', {
              email: EMAIL_SUPPORT,
              link: (chunks) => (
                <a href={`mailto:${EMAIL_SUPPORT}`} translate="no">
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
        <div data-reveal data-delay="1" className="flex flex-col gap-1">
          {(Object.keys(faq.items) as (keyof typeof faq.items)[]).map((key) => (
            <Disclosure key={key} label={t(`items.${key}.q`)} glyph="plus" headerPad="20px 0">
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
