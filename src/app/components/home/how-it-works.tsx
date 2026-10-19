import { getFormatter, getTranslations } from 'next-intl/server';

import { PhoneShot } from '@components/phone-shot/phone-shot';
import { Section, SectionHeading } from '@components/section/section';
import type { ScreenId } from '@domains/site/screens';
import { TWO_DIGITS } from '@shared/format/number';

const STEPS = [
  { key: 'step1', screen: 'lesson' },
  { key: 'step2', screen: 'fill' },
  { key: 'step3', screen: 'complete' },
] as const satisfies readonly { key: string; screen: ScreenId }[];

export async function HowItWorks() {
  const t = await getTranslations('how');
  const format = await getFormatter();

  return (
    <Section id="how">
      <SectionHeading>{t('title')}</SectionHeading>
      <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(24px,3vw,40px)]">
        {STEPS.map((step, index) => (
          <div
            key={step.key}
            data-reveal
            data-delay={index + 1}
            className="flex flex-col gap-[22px]"
          >
            <div className="flex aspect-[4/4.2] items-end justify-center overflow-hidden rounded-3xl bg-surface-2 px-[clamp(20px,3vw,36px)] pt-[clamp(20px,3vw,36px)]">
              <PhoneShot
                screen={step.screen}
                alt={t(`items.${step.key}.alt`)}
                sizes="250px"
                riseOffset="34%"
                className="w-[min(78%,250px)] shadow-[0_30px_60px_-20px_rgba(27,22,20,.5)]"
              />
            </div>
            <div>
              <div className="ff-mono mb-2.5 text-[11px] tracking-[.16em] text-accent uppercase">
                {t('step', { n: format.number(index + 1, TWO_DIGITS) })}
              </div>
              <h3 className="ff-display m-0 text-[26px] leading-[1.1] font-normal tracking-[-0.015em]">
                {t(`items.${step.key}.title`)}
              </h3>
              <p className="ff-ui mt-2.5 mb-0 text-[15px] leading-[1.6] text-pretty text-ink-mute">
                {t(`items.${step.key}.body`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
