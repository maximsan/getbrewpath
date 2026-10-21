import { getFormatter, getTranslations } from 'next-intl/server';
import type { ComponentType } from 'react';

import {
  BeansIcon,
  BrewingIcon,
  GrindIcon,
  ProcessingIcon,
  RoastingIcon,
} from '@components/icons/icons';
import { Section, SectionHeading } from '@components/section/section';
import type { Course } from '@domains/course/build-course';
import { courseCounts } from '@domains/course/course';
import { MINUTES_PER_LESSON } from '@domains/site/site';
import type { Messages } from '@i18n/messages';
import { TWO_DIGITS } from '@shared/format/number';
import { cn } from '@shared/styles/cn';

const MODULE_ICONS: Record<string, ComponentType> = {
  m1: BeansIcon,
  m2: ProcessingIcon,
  m3: RoastingIcon,
  m4: GrindIcon,
  m5: BrewingIcon,
};

/** The reveal stagger goes up to four steps. */
const MAX_DELAY = 4;
/** Module 1 is the free one. */
const FREE_MODULE_NUMBER = 1;

export async function ModulesStrip({ course }: { course: Course }) {
  const t = await getTranslations('modules');
  const counts = courseCounts(course);
  const format = await getFormatter();

  return (
    <Section id="why" className="pt-[clamp(56px,8vw,104px)]">
      <SectionHeading
        meta={t('meta', {
          lessons: counts.lessons,
          cards: counts.cards,
          minutes: MINUTES_PER_LESSON,
        })}
      >
        {t('title')}
      </SectionHeading>
      <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-8">
        {course.modules.map((module, index) => {
          const Icon = MODULE_ICONS[module.id] ?? BeansIcon;
          const free = module.number === FREE_MODULE_NUMBER;
          const key = module.id as keyof Messages['modules']['items'];
          return (
            <div
              key={module.id}
              data-reveal
              data-delay={Math.min(index, MAX_DELAY)}
              // Five to a row when they fit: the row minus its four 24px gaps, split five ways.
              className="flex w-full min-w-0 flex-none flex-col gap-3.5 border-t border-rule pt-[22px] min-[600px]:w-[clamp(180px,calc((100%_-_96px)/5),320px)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex text-accent">
                  <Icon />
                </span>
                <span className="ff-mono text-[11px] tracking-[.14em] text-ink-mute">
                  {format.number(module.number, TWO_DIGITS)}
                </span>
              </div>
              <div>
                <h3 className="ff-display m-0 text-[26px] leading-[1.05] font-normal tracking-[-0.015em] wrap-anywhere">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="ff-ui mt-1.5 mb-0 text-[13px] leading-[1.45] text-ink-mute">
                  {t(`items.${key}.desc`)}
                </p>
              </div>
              <div
                className={cn(
                  'ff-mono text-[11px] leading-normal tracking-[.1em] uppercase',
                  free ? 'text-sage' : 'text-ink-mute',
                )}
              >
                {t(free ? 'lessonsFree' : 'lessons', { n: module.lessonCount })}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
