import { getTranslations } from 'next-intl/server';
import type { ComponentType, ReactNode } from 'react';

import { BeanIcon, CupIcon, LeafIcon, RouteIcon } from '@components/icons/icons';
import { PhoneShot } from '@components/phone-shot/phone-shot';
import { Section, SectionHeading } from '@components/section/section';
import type { ScreenId } from '@domains/site/screens';

import { WelcomePhone } from './welcome-phone';

const SHOT_FEATURES = [
  { key: 'path', screen: 'path', Icon: RouteIcon },
  { key: 'today', screen: 'today', Icon: CupIcon },
  { key: 'roasty', screen: 'roasty', Icon: LeafIcon },
] as const satisfies readonly { key: string; screen: ScreenId; Icon: ComponentType }[];

export async function Features() {
  const t = await getTranslations('features');

  return (
    <Section>
      <SectionHeading>{t('title')}</SectionHeading>
      <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-[clamp(16px,2.4vw,28px)]">
        {SHOT_FEATURES.map(({ key, screen, Icon }, index) => (
          <FeatureCard
            key={key}
            delay={index + 1}
            icon={<Icon />}
            title={t(`items.${key}.title`)}
            body={t(`items.${key}.body`)}
          >
            <PhoneShot
              screen={screen}
              alt={t(`items.${key}.alt`)}
              sizes="200px"
              riseOffset="30%"
              className="w-[min(100%,200px)] shadow-[0_30px_60px_-20px_rgba(27,22,20,.5)]"
            />
          </FeatureCard>
        ))}
        <FeatureCard
          delay={SHOT_FEATURES.length + 1}
          icon={<BeanIcon />}
          title={
            <>
              {/* The title names the mood on screen; CSS picks it so it matches before hydration. */}
              <span className="in-data-[mood=dark-roast]:hidden">{t('moodTitleLight')}</span>
              <span className="hidden in-data-[mood=dark-roast]:inline">{t('moodTitleDark')}</span>
            </>
          }
          body={t('items.mood.body')}
        >
          <WelcomePhone alt={t('items.mood.alt')} />
        </FeatureCard>
      </div>
    </Section>
  );
}

interface FeatureCardProps {
  delay: number;
  icon: ReactNode;
  title: ReactNode;
  body: string;
  children: ReactNode;
}

function FeatureCard({ delay, icon, title, body, children }: FeatureCardProps) {
  return (
    <div
      data-reveal
      data-delay={delay}
      className="grid min-h-[300px] grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] overflow-hidden rounded-3xl border border-rule bg-surface min-[600px]:min-h-[340px]"
    >
      <div className="flex flex-col justify-center py-6 ps-[22px] pe-1 min-[600px]:py-[30px] min-[600px]:ps-[30px] min-[600px]:pe-2">
        <div className="mb-4 inline-flex text-accent">{icon}</div>
        <h3 className="ff-display m-0 text-[clamp(22px,2.2vw,26px)] leading-[1.1] font-normal tracking-[-0.015em] text-balance">
          {title}
        </h3>
        <p className="ff-ui mt-2.5 mb-0 text-sm leading-[1.6] text-pretty text-ink-mute">{body}</p>
      </div>
      <div className="relative flex items-end justify-center overflow-hidden bg-linear-to-b from-transparent to-surface-2 px-5 pt-[30px]">
        {children}
      </div>
    </div>
  );
}
