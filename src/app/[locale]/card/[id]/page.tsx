import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { ComponentType, ReactNode } from 'react';

import { RewardCard } from '@components/brewpath/reward-card/reward-card';
import { CardsIcon, LeafIcon, RouteIcon, ShareIcon } from '@components/icons/icons';
import { ButtonRow } from '@components/button-row/button-row';
import { LinkButton } from '@components/link-button/link-button';
import { monoNoteClass } from '@components/section/section';
import { cardRouteParams, courseCounts, findCard, getCourse } from '@domains/course/course';
import { pageMetadata } from '@domains/site/page-metadata';
import { cardPath, PAGE_ROUTES } from '@domains/site/routes';
import { APP_STORE_URL, appCardLink } from '@domains/site/site';
import { Link } from '@i18n/navigation';
import { setPageLocale } from '@i18n/page-locale';

interface CardPageProps {
  params: Promise<{ locale: string; id: string }>;
}

/** Every card is known at build time; any other id is a 404. */
export const dynamicParams = false;

export const generateStaticParams = cardRouteParams;

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  const locale = await setPageLocale(params);
  const card = findCard(await getCourse(locale), (await params).id);
  if (!card) return {};
  const translate = await getTranslations({ locale, namespace: 'metadata' });
  const title = translate('cardTitle', { card: card.reward.title });
  const description = translate('cardDescription', { summary: card.reward.summary });
  const path = cardPath(card.id);
  return pageMetadata({
    locale,
    absoluteTitle: title,
    description,
    path,
    shareImage: `${path}/opengraph-image`,
  });
}

const PITCH = [
  { key: 'lessons', Icon: RouteIcon },
  { key: 'cards', Icon: CardsIcon },
  { key: 'tree', Icon: LeafIcon },
] as const satisfies readonly { key: string; Icon: ComponentType }[];

export default async function CardPage({ params }: CardPageProps) {
  const course = await getCourse(await setPageLocale(params));
  const card = findCard(course, (await params).id);
  if (!card) notFound();
  const counts = courseCounts(course);
  const translate = await getTranslations('card');

  const strong = (chunks: ReactNode) => <strong className="font-medium text-ink">{chunks}</strong>;
  const body =
    card.source === 'lesson'
      ? translate.rich('lessonBody', {
          lesson: card.lessonTitle,
          lessonNumber: card.lessonNumber,
          module: card.moduleTitle,
          strong,
        })
      : translate.rich('moduleRewardBody', { module: card.moduleTitle, strong });

  return (
    <section className="page-width px-6 pt-[clamp(32px,5vw,64px)]">
      <div className="ff-mono mb-7 flex items-center gap-2.5 text-[11px] tracking-[.16em] text-ink-mute uppercase">
        <ShareIcon size={16} className="flex-none" />
        {translate('shared')}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-10">
        <div
          data-mood="dark-roast"
          className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-[28px] border border-rule bg-surface px-6 py-[clamp(32px,5vw,64px)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_65%)]" />
          <div className="relative w-full max-w-[320px]">
            <RewardCard reward={card.reward} />
          </div>
        </div>
        <div className="animate-rise-in [animation-delay:.1s]">
          <h1 className="ff-display m-0 text-[clamp(34px,4.6vw,58px)] leading-[1.02] font-normal tracking-[-0.025em] text-balance">
            {translate.rich('earned', {
              card: card.reward.title,
              em: (chunks) => <em>{chunks}</em>,
            })}
          </h1>
          <p className="ff-ui mt-5 mb-0 max-w-[46ch] text-base leading-[1.6] text-pretty text-ink-mute">
            {body}
          </p>
          <ButtonRow className="mt-[30px] items-center">
            <LinkButton href={APP_STORE_URL} tone="ink" size="xl">
              {translate('get')}
            </LinkButton>
            <LinkButton href={appCardLink(card.id)} tone="outline" size="xl">
              {translate('open')}
            </LinkButton>
          </ButtonRow>
          <div className={`${monoNoteClass} mt-[18px]`}>{translate('avail')}</div>
        </div>
      </div>

      <div className="mt-[clamp(56px,8vw,96px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-8">
        {PITCH.map(({ key, Icon }) => (
          <div key={key} className="flex flex-col gap-3 border-t border-rule pt-[22px]">
            <span className="inline-flex text-accent">
              <Icon />
            </span>
            <h2 className="ff-display m-0 text-[22px] leading-[1.1] font-normal tracking-[-0.01em]">
              {translate(`pitch.${key}.title`, {
                lessons: counts.lessons,
                cards: counts.cards,
              })}
            </h2>
            <p className="ff-ui m-0 text-sm leading-[1.55] text-ink-mute">
              {translate(`pitch.${key}.body`)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="ff-ui text-[15px] text-ink-mute">
          {translate.rich('curious', {
            link: (chunks) => <Link href={PAGE_ROUTES.home}>{chunks}</Link>,
          })}
        </div>
        <div className="ff-mono text-[11px] tracking-[.1em] text-ink-mute uppercase">
          {translate('count', { cards: counts.cards, moduleRewards: counts.moduleRewards })}
        </div>
      </div>
    </section>
  );
}
