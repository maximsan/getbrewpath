import { getFormatter, getMessages, getTranslations } from 'next-intl/server';

import { CheckIcon } from '@components/icons/icons';
import { LinkButton } from '@components/link-button/link-button';
import { Section, SectionHeading } from '@components/section/section';
import { formatPrice } from '@domains/site/price';
import { APP_STORE_URL, PRICE_FOUNDATIONS, PRICE_FREE } from '@domains/site/site';
import { cn } from '@shared/styles/cn';

export async function Pricing() {
  const t = await getTranslations('pricing');
  const format = await getFormatter();
  const { pricing } = await getMessages();

  return (
    <Section id="pricing">
      <SectionHeading>{t('title')}</SectionHeading>
      <div className="mx-auto mt-12 grid max-w-[900px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
        <div
          data-reveal
          data-delay="1"
          className="flex flex-col gap-[22px] rounded-3xl border border-rule bg-surface p-8"
        >
          <div>
            <div className="smallcaps mb-2.5">{t('free')}</div>
            <Price amount={formatPrice(format, PRICE_FREE)} note={t('forever')} />
          </div>
          <Checklist items={Object.values(pricing.freeList)} tone="sage" />
          <LinkButton href={APP_STORE_URL} tone="outline" size="lg" className="mt-auto">
            {t('freeCta')}
          </LinkButton>
        </div>
        <div
          data-reveal
          data-delay="2"
          data-mood="dark-roast"
          className="relative flex flex-col gap-[22px] overflow-hidden rounded-3xl border border-rule bg-surface p-8"
        >
          <div className="pointer-events-none absolute -right-[20%] -bottom-1/2 aspect-square w-[70%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_24%,transparent),transparent)]" />
          <div className="relative">
            <div className="smallcaps mb-2.5 text-accent!">{t('pro')}</div>
            <Price amount={formatPrice(format, PRICE_FOUNDATIONS)} note={t('once')} />
          </div>
          <Checklist items={Object.values(pricing.proList)} tone="accent" />
          <LinkButton href={APP_STORE_URL} tone="accent" size="lg" className="relative mt-auto">
            {t('proCta')}
          </LinkButton>
        </div>
      </div>
      <p className="ff-ui mx-auto mt-5 mb-0 max-w-[62ch] text-center text-[13px] leading-normal text-ink-mute">
        {t('note')}
      </p>
    </Section>
  );
}

function Price({ amount, note }: { amount: string; note: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="ff-mono text-[40px] leading-none font-medium tracking-[-0.02em]">
        {amount}
      </span>
      <span className="ff-ui text-sm text-ink-mute">{note}</span>
    </div>
  );
}

function Checklist({ items, tone }: { items: string[]; tone: 'sage' | 'accent' }) {
  return (
    <ul className="relative m-0 flex list-none flex-col gap-3 p-0">
      {items.map((item) => (
        <li key={item} className="ff-ui flex gap-3 text-[15px] leading-[1.45] text-ink">
          <span
            className={cn(
              'mt-[3px] inline-flex flex-none',
              tone === 'sage' ? 'text-sage' : 'text-accent',
            )}
          >
            <CheckIcon size={16} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
