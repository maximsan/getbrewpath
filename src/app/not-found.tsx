import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Roasty } from '@components/brewpath/roasty/roasty';
import { LinkButton } from '@components/link-button/link-button';
import { pageTitleClass } from '@components/section/section';
import { APP_STORE_URL } from '@domains/site/site';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return { title: t('notFound') };
}

const ROASTY_SIZE = 170;

export default async function NotFound() {
  const t = await getTranslations('notfound');

  return (
    <section className="mx-auto flex max-w-[1160px] flex-col items-center px-6 pt-[clamp(48px,8vw,96px)] text-center">
      <div className="flex min-h-60 items-center justify-center">
        <Roasty state="sleep" size={ROASTY_SIZE} hat="beanie" gear="none" sprout="sprig" />
      </div>
      <div className="ff-mono mt-3 text-[11px] tracking-[.24em] text-ink-mute uppercase">
        {t('label')}
      </div>
      <h1 className={`${pageTitleClass} mt-4`}>{t('title')}</h1>
      <p className="ff-ui mt-[18px] mb-0 max-w-[40ch] text-[17px] leading-[1.6] text-pretty text-ink-mute">
        {t('body')}
      </p>
      <div className="mt-[30px] flex flex-wrap justify-center gap-3">
        <LinkButton href="/" tone="ink" size="lg">
          {t('back')}
        </LinkButton>
        <LinkButton href={APP_STORE_URL} tone="outline" size="lg">
          {t('get')}
        </LinkButton>
      </div>
    </section>
  );
}
