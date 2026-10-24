import { getTranslations } from 'next-intl/server';

import { ButtonRow } from '@components/button-row/button-row';
import { LinkButton } from '@components/link-button/link-button';
import { PhoneShot } from '@components/phone-shot/phone-shot';
import { monoNoteClass, twoColumnClass } from '@components/section/section';
import { sectionHref } from '@components/site-header/nav-items';
import { APP_STORE_URL } from '@domains/site/site';

export async function Hero() {
  const translate = await getTranslations('hero');

  return (
    <section
      className={`${twoColumnClass} page-width px-6 pt-[clamp(48px,8vw,96px)] pb-[clamp(40px,6vw,72px)]`}
    >
      <div className="stacked:text-center">
        <h1 className="ff-display m-0 animate-rise-in text-[clamp(42px,6.2vw,76px)] leading-none font-normal tracking-[-0.025em] text-balance whitespace-pre-line">
          {translate('title')}
        </h1>
        <p className="ff-ui mt-[26px] mb-0 max-w-[46ch] animate-rise-in text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-pretty text-ink-mute [animation-delay:.08s] stacked:mx-auto">
          {translate('body')}
        </p>
        <ButtonRow className="mt-[34px] animate-rise-in items-center [animation-delay:.16s] stacked:justify-center">
          <LinkButton href={APP_STORE_URL} tone="ink" size="xl">
            {translate('download')}
          </LinkButton>
          <LinkButton href={sectionHref('demo')} tone="outline" size="xl">
            {translate('tryFirst')}
          </LinkButton>
        </ButtonRow>
        <div className={`${monoNoteClass} mt-[18px] animate-rise-in [animation-delay:.24s]`}>
          {translate('note')}
        </div>
      </div>
      <div className="-mx-6 flex animate-[rise-in_1s_var(--ease-out-soft)_.2s_both] items-start justify-center px-6 pt-8">
        <PhoneShot
          screen="today"
          alt={translate('shotToday')}
          sizes="270px"
          priority
          className="z-[2] w-[min(44%,270px)] flex-none shadow-[0_40px_70px_-24px_rgba(27,22,20,.55)]"
        />
        <PhoneShot
          screen="lesson"
          alt={translate('shotLesson')}
          sizes="240px"
          priority
          className="z-[1] -ms-[12%] mt-[14%] w-[min(39%,240px)] flex-none shadow-[0_30px_60px_-20px_rgba(27,22,20,.45)]"
        />
      </div>
    </section>
  );
}
