import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { ComponentType, ReactNode } from 'react';

import { RewardCard } from '@components/brewpath/reward-card/reward-card';
import { CardsIcon, LeafIcon, RouteIcon, ShareIcon } from '@components/icons/icons';
import { LinkButton } from '@components/link-button/link-button';
import { monoNoteClass } from '@components/section/section';
import { cardRouteParams, courseCounts, findCard } from '@domains/course/course';
import { APP_STORE_URL, appCardLink } from '@domains/site/site';

import { pageMetadata } from '@domains/site/page-metadata';

interface CardPageProps {
  params: Promise<{ id: string }>;
}

/** Every card is known at build time; any other id is a 404. */
export const dynamicParams = false;

export const generateStaticParams = cardRouteParams;

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  const card = findCard((await params).id);
  if (!card) return {};
  const t = await getTranslations('metadata');
  const title = t('cardTitle', { card: card.reward.title });
  const description = t('cardDescription', { summary: card.reward.summary });
  const path = `/card/${card.id}`;
  return pageMetadata({
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
  const card = findCard((await params).id);
  if (!card) notFound();
  const t = await getTranslations('card');

  const strong = (chunks: ReactNode) => <strong className="font-medium text-ink">{chunks}</strong>;
  const body =
    card.source === 'lesson'
      ? t.rich('lessonBody', {
          lesson: card.lessonTitle,
          lessonNumber: card.lessonNumber,
          module: card.moduleTitle,
          strong,
        })
      : t.rich('guideBody', { module: card.moduleTitle, strong });

  return (
    <section className="page-width px-6 pt-[clamp(32px,5vw,64px)]">
      <div className="ff-mono mb-7 flex items-center gap-2.5 text-[11px] tracking-[.16em] text-ink-mute uppercase">
        <ShareIcon size={16} className="flex-none" />
        {t('shared')}
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
            {t.rich('earned', { card: card.reward.title, em: (chunks) => <em>{chunks}</em> })}
          </h1>
          <p className="ff-ui mt-5 mb-0 max-w-[46ch] text-base leading-[1.6] text-pretty text-ink-mute">
            {body}
          </p>
          <div className="mt-[30px] flex flex-wrap items-center gap-3">
            <LinkButton href={APP_STORE_URL} tone="ink" size="xl">
              {t('get')}
            </LinkButton>
            <LinkButton href={appCardLink(card.id)} tone="outline" size="xl">
              {t('open')}
            </LinkButton>
          </div>
          <div className={`${monoNoteClass} mt-[18px]`}>{t('avail')}</div>
        </div>
      </div>

      <div className="mt-[clamp(56px,8vw,96px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-8">
        {PITCH.map(({ key, Icon }) => (
          <div key={key} className="flex flex-col gap-3 border-t border-rule pt-[22px]">
            <span className="inline-flex text-accent">
              <Icon />
            </span>
            <h2 className="ff-display m-0 text-[22px] leading-[1.1] font-normal tracking-[-0.01em]">
              {t(`pitch.${key}.title`, {
                lessons: courseCounts.lessons,
                cards: courseCounts.cards,
              })}
            </h2>
            <p className="ff-ui m-0 text-sm leading-[1.55] text-ink-mute">
              {t(`pitch.${key}.body`)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="ff-ui text-[15px] text-ink-mute">
          {t.rich('curious', { link: (chunks) => <Link href="/">{chunks}</Link> })}
        </div>
        <div className="ff-mono text-[11px] tracking-[.1em] text-ink-mute uppercase">
          {t('count', { cards: courseCounts.cards, guides: courseCounts.fieldGuides })}
        </div>
      </div>
    </section>
  );
}
