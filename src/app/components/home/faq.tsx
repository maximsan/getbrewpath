import Link from 'next/link';
import { getMessages, getTranslations } from 'next-intl/server';

import { Disclosure } from '@components/brewpath/disclosure/disclosure';
import { Section, sectionTitleClass } from '@components/section/section';

export async function Faq() {
  const t = await getTranslations('faq');
  const { faq } = await getMessages();

  return (
    <Section id="faq">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-10">
        <div data-reveal>
          <h2 className={sectionTitleClass}>{t('title')}</h2>
          <p className="ff-ui mt-[18px] mb-0 max-w-[40ch] text-[15px] leading-[1.6] text-ink-mute">
            {t.rich('more', { link: (chunks) => <Link href="/support">{chunks}</Link> })}
          </p>
        </div>
        <div data-reveal data-delay="1" className="border-t border-rule">
          {Object.values(faq.items).map((item) => (
            <Disclosure key={item.q} label={item.q} glyph="plus" divider headerPad="20px 0">
              <p className="ff-ui mt-0 mb-[18px] max-w-[60ch] text-[15px] leading-[1.65] text-pretty text-ink-mute">
                {item.a}
              </p>
            </Disclosure>
          ))}
        </div>
      </div>
    </Section>
  );
}
