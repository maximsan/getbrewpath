import { getTranslations } from 'next-intl/server';

import { ButtonRow } from '@components/button-row/button-row';
import { LinkButton } from '@components/link-button/link-button';
import { PhoneShotGroup } from '@components/phone-shot';
import { monoNoteClass, twoColumnClass } from '@components/section/section';
import { sectionHref } from '@components/site-header/nav-items';
import { APP_STORE_URL } from '@domains/site/site';
import { cn } from '@shared/styles/cn';

export async function Hero() {
  const translate = await getTranslations('hero');

  return (
    <section
      className={cn(
        twoColumnClass,
        'page-width px-6 pt-[clamp(48px,8vw,96px)] pb-[clamp(40px,6vw,72px)]',
      )}
    >
      <div className="stacked:text-center">
        <h1 className="ff-display m-0 animate-rise-in text-[clamp(42px,6.2vw,76px)] leading-none font-normal tracking-tight text-balance whitespace-pre-line">
          {translate('title')}
        </h1>
        <p className="ff-ui mt-6.5 mb-0 max-w-[46ch] animate-rise-in text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-pretty text-ink-mute [animation-delay:.08s] stacked:mx-auto">
          {translate('body')}
        </p>
        <ButtonRow className="mt-8.5 animate-rise-in items-center [animation-delay:.16s] stacked:justify-center">
          <LinkButton href={APP_STORE_URL} tone="ink" size="xl" className="min-w-58">
            {translate('download')}
          </LinkButton>
          <LinkButton href={sectionHref('demo')} tone="outline" size="xl" className="min-w-58">
            {translate('tryFirst')}
          </LinkButton>
        </ButtonRow>
        <div className={cn(monoNoteClass, 'mt-4.5 animate-rise-in [animation-delay:.24s]')}>
          {translate('note')}
        </div>
      </div>
      <PhoneShotGroup alt1={translate('shotToday')} alt2={translate('shotLesson')} />
    </section>
  );
}
