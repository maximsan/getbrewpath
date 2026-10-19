import { getTranslations } from 'next-intl/server';

import { LinkButton } from '@components/link-button/link-button';
import { Section } from '@components/section/section';
import { APP_STORE_URL } from '@domains/site/site';

export async function FinalCta() {
  const t = await getTranslations('cta');

  return (
    <Section>
      <div
        data-mood="dark-roast"
        data-reveal
        className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[28px] border border-rule bg-surface px-[clamp(24px,5vw,64px)] py-[clamp(48px,7vw,88px)] text-center"
      >
        <div className="pointer-events-none absolute -top-[40%] left-1/4 aspect-square w-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_18%,transparent),transparent)]" />
        <div className="relative">
          <h2 className="ff-display m-0 text-[clamp(32px,4.4vw,56px)] leading-[1.02] font-normal tracking-[-0.025em] text-balance">
            {t('title')}
          </h2>
          <p className="ff-ui mx-auto mt-[18px] mb-0 max-w-[44ch] text-base leading-[1.6] text-ink-mute">
            {t('body')}
          </p>
        </div>
        <LinkButton href={APP_STORE_URL} tone="accent" size="hero" className="relative">
          {t('download')}
        </LinkButton>
      </div>
    </Section>
  );
}
