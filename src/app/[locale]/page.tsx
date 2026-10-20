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
import { DEMO_REWARD_CARD_ID, getCourse, rewardOf } from '@domains/course/course';
import { type LocaleParams, setPageLocale } from '@i18n/page-locale';

export default async function HomePage({ params }: LocaleParams) {
  const course = await getCourse(await setPageLocale(params));

  return (
    <>
      <Hero />
      <ModulesStrip course={course} />
      <HowItWorks />
      <Features />
      <Section id="demo">
        <div
          data-mood="dark-roast"
          data-reveal
          className="overflow-hidden rounded-[28px] border border-rule bg-surface px-[clamp(24px,5vw,64px)] py-[clamp(32px,5vw,64px)]"
        >
          <LessonDemo reward={rewardOf(course, DEMO_REWARD_CARD_ID)} />
        </div>
      </Section>
      <Section>
        <RoastyShowcase />
      </Section>
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
