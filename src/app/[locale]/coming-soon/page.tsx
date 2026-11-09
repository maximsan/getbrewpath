import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LinkButton } from '@components/link-button/link-button';
import { Roasty } from '@components/brewpath/roasty/roasty';
import { Link } from '@i18n/navigation';
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
    <section className="page-width px-6 pt-[clamp(32px,6vw,80px)] pb-4">
      <div className="grid items-center gap-12 tablet:grid-cols-2 tablet:gap-[clamp(40px,7vw,96px)]">
        <div className="animate-rise-in py-4">
          <h1 className="ff-display m-0 text-[clamp(36px,4.4vw,60px)] leading-[1.02] font-normal tracking-tight text-balance">
            {translate.rich('heading', {
              em: (words) => <em className="block">{words}</em>,
            })}
          </h1>
          <p className="ff-ui mt-7 mb-0 max-w-[34ch] text-[17px] leading-[1.6] text-pretty text-ink-mute">
            {translate('body')}
          </p>
          <div className="mt-7 flex flex-col items-start gap-5">
            <LinkButton href={sectionHref('demo')} tone="ink" size="lg">
              {translate('tryLesson')}
            </LinkButton>
            {card && (
              <Link
                href={cardPath(card.id)}
                className="ff-ui inline-flex items-center gap-2 text-sm text-ink-mute underline decoration-rule underline-offset-4 transition-colors hover:text-ink"
              >
                <span aria-hidden="true">←</span>
                {translate('backToCard')}
              </Link>
            )}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="relative isolate mx-auto flex aspect-square w-full max-w-90 items-center justify-center overflow-hidden rounded-t-full rounded-b-[28px] bg-surface-2"
        >
          <div className="pointer-events-none absolute inset-5 -z-10 rounded-t-full rounded-b-[18px] bg-sage/10" />
          <Roasty size="large" state="idle" />
        </div>
      </div>
    </section>
  );
}
