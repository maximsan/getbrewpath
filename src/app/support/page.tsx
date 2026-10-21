import type { Metadata } from 'next';
import { getMessages, getTranslations } from 'next-intl/server';
import type { ComponentType } from 'react';

import { LeafIcon, LockIcon, RematchIcon } from '@components/icons/icons';
import { pageTitleClass } from '@components/section/section';
import { pageMetadata } from '@domains/site/page-metadata';
import { PAGE_ROUTES } from '@domains/site/routes';
import { EMAIL_HELLO } from '@domains/site/site';
import type { Messages } from '@i18n/messages';

import { SupportForm } from './support-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return pageMetadata({
    title: t('metadata.support'),
    description: t('support.body'),
    path: PAGE_ROUTES.support,
  });
}

const TOPICS = [
  { key: 'restore', Icon: RematchIcon },
  { key: 'refund', Icon: LockIcon },
  { key: 'progress', Icon: LeafIcon },
] as const satisfies readonly {
  key: keyof Messages['support']['topics'];
  Icon: ComponentType<{ size?: number }>;
}[];

export default async function SupportPage() {
  const t = await getTranslations('support');
  const { support } = await getMessages();

  return (
    <section className="page-width px-6 pt-[clamp(40px,6vw,72px)]">
      <div className="max-w-[720px]">
        <h1 className={pageTitleClass}>{t('title')}</h1>
        <p className="ff-ui mt-5 mb-0 text-[17px] leading-[1.6] text-pretty text-ink-mute">
          {t('body')}
        </p>
      </div>
      <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
        {TOPICS.map(({ key, Icon }) => {
          const topic = support.topics[key];
          return (
            <div
              key={key}
              className="flex flex-col gap-3 rounded-3xl border border-rule bg-surface p-7"
            >
              <span className="inline-flex text-accent">
                <Icon size={26} />
              </span>
              <h2 className="ff-display m-0 text-2xl leading-[1.1] font-normal tracking-[-0.015em]">
                {topic.title}
              </h2>
              <ol className="mt-1 mb-0 flex flex-col gap-2 ps-[18px]">
                {Object.values(topic.steps).map((step) => (
                  <li key={step} className="ff-ui text-sm leading-[1.55] text-ink-mute">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
      <div className="mt-[clamp(56px,8vw,96px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-10">
        <div>
          <h2 className="ff-display m-0 text-[clamp(28px,3.4vw,40px)] leading-[1.05] font-normal tracking-[-0.02em]">
            {t('heading')}
          </h2>
          <div className="mt-6 flex flex-col gap-3.5">
            <a
              href={`mailto:${EMAIL_HELLO}`}
              translate="no"
              className="ff-ui inline-flex items-center gap-2.5 text-[17px] font-medium wrap-anywhere"
            >
              {EMAIL_HELLO}
            </a>
            <p className="ff-ui m-0 text-sm leading-[1.55] text-ink-mute">{t('include')}</p>
          </div>
        </div>
        <SupportForm />
      </div>
    </section>
  );
}
