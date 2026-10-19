import { getTranslations } from 'next-intl/server';

import { LinkButton } from '@components/link-button/link-button';
import { PhoneShot } from '@components/phone-shot/phone-shot';
import { monoNoteClass } from '@components/section/section';
import { APP_STORE_URL } from '@domains/site/site';

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="mx-auto grid max-w-[1160px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-10 px-6 pt-[clamp(48px,8vw,96px)] pb-[clamp(40px,6vw,72px)]">
      <div>
        <h1 className="ff-display m-0 animate-rise-in text-[clamp(42px,6.2vw,76px)] leading-none font-normal tracking-[-0.025em] text-balance whitespace-pre-line">
          {t('title')}
        </h1>
        <p className="ff-ui mt-[26px] mb-0 max-w-[46ch] animate-rise-in text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-pretty text-ink-mute [animation-delay:.08s]">
          {t('body')}
        </p>
        <div className="mt-[34px] flex animate-rise-in flex-wrap items-center gap-3 [animation-delay:.16s]">
          <LinkButton href={APP_STORE_URL} tone="ink" size="xl">
            {t('download')}
          </LinkButton>
          <LinkButton href="/#demo" tone="outline" size="xl">
            {t('tryFirst')}
          </LinkButton>
        </div>
        <div className={`${monoNoteClass} mt-[18px] animate-rise-in [animation-delay:.24s]`}>
          {t('note')}
        </div>
      </div>
      <div className="-mx-6 flex animate-[rise-in_1s_var(--ease-out-soft)_.2s_both] items-center justify-center overflow-hidden px-6 py-8">
        <PhoneShot
          screen="today"
          alt={t('shotToday')}
          sizes="270px"
          priority
          className="z-[2] w-[min(44%,270px)] flex-none animate-hero-float shadow-[0_40px_70px_-24px_rgba(27,22,20,.55)]"
        />
        <PhoneShot
          screen="lesson"
          alt={t('shotLesson')}
          sizes="240px"
          priority
          className="z-[1] -ms-[12%] mt-[14%] w-[min(39%,240px)] flex-none animate-hero-float-2 shadow-[0_30px_60px_-20px_rgba(27,22,20,.45)]"
        />
      </div>
    </section>
  );
}
