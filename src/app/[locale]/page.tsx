import { getTranslations } from 'next-intl/server';

import { Faq } from '@components/home/faq';
import { Features } from '@components/home/features';
import { FinalCta } from '@components/home/final-cta';
import { Hero } from '@components/home/hero';
import { HowItWorks } from '@components/home/how-it-works';
import { LessonDemo } from '@components/home/lesson-demo';
import { ModulesStrip } from '@components/home/modules-strip';
import { Pricing } from '@components/home/pricing';
import { RoastyShowcase } from '@components/home/roasty-showcase';
import { Section } from '@components/section/section';
import { getCardArtImage } from '@domains/course/card-art';
import { DEMO_REWARD_CARD_ID, findCard, getCourse } from '@domains/course/course';
import { type LocaleParams, setPageLocale } from '@i18n/page-locale';

export default async function HomePage({ params }: LocaleParams) {
  const locale = await setPageLocale(params);
  const course = await getCourse(locale);
  const demoCard = findCard(course, DEMO_REWARD_CARD_ID);

  if (!demoCard) {
    console.warn(`Missing demo Coffee Card ${DEMO_REWARD_CARD_ID} in the ${locale} course`);
  }

  const translate = await getTranslations('demo');

  return (
    <>
      <Hero />
      <Section id="why" className="pt-[clamp(56px,8vw,104px)]">
        <RoastyShowcase />
        <ModulesStrip course={course} />
      </Section>
      <HowItWorks />
      <Features />
      <Section id="demo">
        <div
          data-reveal
          className="overflow-hidden rounded-[28px] border border-rule bg-surface px-[clamp(24px,5vw,64px)] py-[clamp(32px,5vw,64px)]"
        >
          {demoCard ? (
            <LessonDemo
              reward={demoCard.reward}
              illustration={await getCardArtImage(locale, demoCard.kind, 'dark-roast')}
            />
          ) : (
            <p className="ff-ui m-0 text-base text-ink-mute">{translate('unavailable')}</p>
          )}
        </div>
      </Section>
      <Pricing course={course} />
      <Faq course={course} />
      <FinalCta />
    </>
  );
}
