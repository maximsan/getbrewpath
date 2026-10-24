import { getFormatter, getTranslations } from 'next-intl/server';
import type { ComponentType } from 'react';

import {
  BeansIcon,
  BrewingIcon,
  GrindIcon,
  ProcessingIcon,
  RoastingIcon,
} from '@components/icons/icons';
import type { Course } from '@domains/course/build-course';
import { courseCounts } from '@domains/course/course';
import { MINUTES_PER_LESSON } from '@domains/site/site';
import type { Messages } from '@i18n/messages';
import { TWO_DIGITS } from '@shared/format/number';

const MODULE_ICONS: Record<string, ComponentType> = {
  m1: BeansIcon,
  m2: ProcessingIcon,
  m3: RoastingIcon,
  m4: GrindIcon,
  m5: BrewingIcon,
};

/** The reveal stagger goes up to four steps. */
const MAX_DELAY = 4;

/** The course's modules in a row of five, under one line with the course's totals. */
export async function ModulesStrip({ course }: { course: Course }) {
  const translate = await getTranslations('modules');
  const counts = courseCounts(course);
  const format = await getFormatter();

  return (
    <>
      <p
        data-reveal
        className="ff-mono mt-[clamp(80px,10vw,128px)] mb-0 text-center text-[13px] leading-normal tracking-[.12em] text-ink-mute uppercase"
      >
        {translate('meta', {
          modules: counts.modules,
          lessons: counts.lessons,
          minutes: MINUTES_PER_LESSON,
        })}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-8">
        {course.modules.map((module, index) => {
          const Icon = MODULE_ICONS[module.id] ?? BeansIcon;
          const key = module.id as keyof Messages['modules']['items'];
          return (
            <div
              key={module.id}
              data-reveal
              data-delay={Math.min(index, MAX_DELAY)}
              // Five to a row when they fit: the row minus its four `gap-x-6` gaps, split five ways.
              className="flex w-full min-w-0 flex-none flex-col gap-3.5 tablet:w-[clamp(148px,calc((100%_-_4*var(--spacing)*6)/5),320px)]"
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
                  {translate(`items.${key}.title`)}
                </h3>
                <p className="ff-ui mt-1.5 mb-0 text-[13px] leading-[1.45] text-ink-mute">
                  {translate(`items.${key}.desc`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
