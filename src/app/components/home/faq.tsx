import { getMessages, getTranslations } from 'next-intl/server';

import { Section, sectionTitleClass } from '@components/section/section';
import type { Course } from '@domains/course/build-course';
import { courseCounts } from '@domains/course/course';
import { EMAIL_HI, MAILTO_HI } from '@domains/site/site';

import { FaqList } from './faq-list';

export async function Faq({ course }: { course: Course }) {
  const t = await getTranslations('faq');
  const { faq } = await getMessages();
  const freeTier = {
    freeLessons: courseCounts(course).freeLessons,
    freeDailyActivities: course.freeDailyActivities,
  };

  return (
    <Section id="faq">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-10">
        <div data-reveal>
          <h2 className={sectionTitleClass}>{t('title')}</h2>
          <p className="ff-ui mt-[18px] mb-0 flex max-w-[40ch] flex-col text-[15px] leading-[1.6] text-ink-mute">
            <span>{t('more')}</span>
            <span className="whitespace-nowrap">
              {t.rich('write', {
                email: EMAIL_HI,
                link: (chunks) => (
                  <a href={MAILTO_HI} translate="no">
                    {chunks}
                  </a>
                ),
              })}
            </span>
          </p>
        </div>
        <div data-reveal data-delay="1" className="flex flex-col gap-1">
          <FaqList
            items={(Object.keys(faq.items) as (keyof typeof faq.items)[]).map((key) => ({
              question: t(`items.${key}.q`),
              answer: t(`items.${key}.a`, freeTier),
            }))}
          />
        </div>
      </div>
    </Section>
  );
}
