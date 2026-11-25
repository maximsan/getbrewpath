import { getMessages, getTranslations } from 'next-intl/server';

import { Section, sectionTitleClass } from '@components/section/section';
import type { Course } from '@domains/course/build-course';
import { courseCounts } from '@domains/course/course';
import { EMAIL_HI, MAILTO_HI } from '@domains/site/site';

import { FaqList } from './faq-list';

export async function Faq({ course }: { course: Course }) {
  const translate = await getTranslations('faq');
  const { faq } = await getMessages();
  const freeTier = {
    freeLessons: courseCounts(course).freeLessons,
    freeDailyActivities: course.freeDailyActivities,
  };

  return (
    <Section id="faq" className="pt-[clamp(40px,6vw,72px)]">
      <div className="grid items-start gap-4 tablet:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] tablet:gap-8">
        <div data-reveal>
          <h2 className={sectionTitleClass}>{translate('title')}</h2>
          <p className="ff-ui mt-4.5 mb-0 flex max-w-[40ch] flex-col text-[15px] leading-[1.6] text-ink-mute">
            <span>{translate('more')}</span>
            <span className="whitespace-nowrap">
              {translate.rich('write', {
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
        <div data-reveal data-delay="1" className="flex flex-col">
          <FaqList
            entries={(Object.keys(faq.items) as (keyof typeof faq.items)[]).map((key) => ({
              question: translate(`items.${key}.q`),
              answer: translate(`items.${key}.a`, freeTier),
            }))}
          />
        </div>
      </div>
    </Section>
  );
}
