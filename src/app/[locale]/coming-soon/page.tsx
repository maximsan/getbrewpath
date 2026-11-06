import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LinkButton } from '@components/link-button/link-button';
import { pageTitleClass } from '@components/section/section';
import { findCard, getCourse } from '@domains/course/course';
import { cardPath } from '@domains/site/routes';
import { sectionHref } from '@components/site-header/nav-items';
import { type LocaleParams, setPageLocale } from '@i18n/page-locale';

interface ComingSoonProps extends LocaleParams {
  searchParams: Promise<{ card?: string | string[] }>;
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await setPageLocale(params);
  const translate = await getTranslations({ locale, namespace: 'availability' });

  return { title: translate('title'), robots: { index: false } };
}

export default async function ComingSoonPage({ params, searchParams }: ComingSoonProps) {
  const locale = await setPageLocale(params);
  const { card: id } = await searchParams;
  const card = typeof id === 'string' ? findCard(await getCourse(locale), id) : undefined;
  const translate = await getTranslations('availability');

  return (
    <section className="page-width flex flex-col items-center gap-6 px-6 pt-[clamp(48px,8vw,96px)] text-center">
      <h1 className={pageTitleClass}>{translate('title')}</h1>
      <p className="ff-ui max-w-[40ch] text-base text-pretty text-ink-mute">{translate('body')}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <LinkButton href={sectionHref('demo')} tone="ink" size="lg">
          {translate('tryLesson')}
        </LinkButton>
        {card && (
          <LinkButton href={cardPath(card.id)} tone="outline" size="lg">
            {translate('backToCard')}
          </LinkButton>
        )}
      </div>
    </section>
  );
}
