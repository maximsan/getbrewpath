import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';

import { linkButtonClass } from '@components/link-button/link-button';
import { PhoneShot } from '@components/phone-shot/phone-shot';
import { pageTitleClass } from '@components/section/section';
import { courseCounts } from '@domains/course/course';
import {
  BRAND_COLORS,
  BRAND_ICON_DOWNLOAD_NAME,
  BRAND_ICON_PATH,
  type BrandColor,
} from '@domains/site/brand';
import { pageMetadata } from '@domains/site/page-metadata';
import { formatPrice } from '@domains/site/price';
import { PAGE_ROUTES } from '@domains/site/routes';
import { screenDownloadName, SCREENS, screenSrc } from '@domains/site/screens';
import { EMAIL_PRESS, PRICE_FOUNDATIONS, SITE_HOST } from '@domains/site/site';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return pageMetadata({
    title: t('metadata.press'),
    description: t('press.body'),
    path: PAGE_ROUTES.press,
  });
}

const labelClass = 'ff-mono text-[11px] tracking-[.08em] text-ink-mute uppercase';

export default async function PressPage() {
  const t = await getTranslations('press');
  const format = await getFormatter();

  const facts = [
    { label: t('facts.name'), value: t('facts.nameV') },
    { label: t('facts.platform'), value: t('facts.platformV') },
    {
      label: t('facts.price'),
      value: t('facts.priceV', { price: formatPrice(format, PRICE_FOUNDATIONS) }),
    },
    {
      label: t('facts.course'),
      value: t('facts.courseV', {
        modules: courseCounts.modules,
        lessons: courseCounts.lessons,
        cards: courseCounts.cards,
      }),
    },
    { label: t('facts.mascot'), value: t('facts.mascotV') },
    { label: t('facts.website'), value: SITE_HOST },
  ];

  return (
    <section className="page-width px-6 pt-[clamp(40px,6vw,72px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-end gap-10">
        <div>
          <h1 className={pageTitleClass}>{t('title')}</h1>
          <p className="ff-ui mt-5 mb-0 text-[17px] leading-[1.6] text-pretty text-ink-mute">
            {t('body')}
          </p>
          <div className="mt-[26px] flex flex-wrap gap-3">
            <a
              href={`mailto:${EMAIL_PRESS}`}
              translate="no"
              className={`${linkButtonClass('ink', 'lg')} wrap-anywhere`}
            >
              {EMAIL_PRESS}
            </a>
            <a
              href={BRAND_ICON_PATH}
              download={BRAND_ICON_DOWNLOAD_NAME}
              className={linkButtonClass('outline', 'lg')}
            >
              {t('downloadIcon')}
            </a>
          </div>
        </div>
        <dl className="m-0 flex flex-col">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-rule py-3.5 last:border-b-0"
            >
              <dt className="smallcaps">{fact.label}</dt>
              <dd className="ff-mono m-0 text-end text-[13px] text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-[clamp(48px,7vw,80px)]">
        <h2 className="smallcaps m-0 mb-[18px]">{t('screens')}</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[18px]">
          {SCREENS.map((screen) => (
            <a
              key={screen}
              href={screenSrc(screen)}
              download={screenDownloadName(screen)}
              className="flex flex-col gap-2.5 text-ink hover:no-underline"
            >
              <PhoneShot screen={screen} alt="" sizes="200px" />
              <span className={labelClass}>{t(`shots.${screen}`)}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-[clamp(48px,7vw,80px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-10">
        <div>
          <h2 className="smallcaps m-0 mb-[18px]">{t('colour')}</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
            {(Object.entries(BRAND_COLORS) as [BrandColor, string][]).map(([key, hex]) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="h-16 rounded-xl border border-rule" style={{ background: hex }} />
                <span className="ff-ui text-[13px] font-medium">{t(`swatches.${key}`)}</span>
                <span translate="no" className="ff-mono text-[11px] tracking-[.06em] text-ink-mute">
                  {hex}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="smallcaps m-0 mb-[18px]">{t('type')}</h2>
          <div className="flex flex-col gap-[18px]">
            <div>
              <div
                translate="no"
                className="ff-display text-[34px] leading-[1.05] tracking-[-0.02em]"
              >
                Fraunces
              </div>
              <div className={`${labelClass} mt-1.5`}>{t('typeTitles')}</div>
            </div>
            <div>
              <div translate="no" className="ff-ui text-2xl leading-[1.1]">
                IBM Plex Sans
              </div>
              <div className={`${labelClass} mt-1.5`}>{t('typeBody')}</div>
            </div>
            <div>
              <div translate="no" className="ff-mono text-[22px] leading-[1.1]">
                IBM Plex Mono
              </div>
              <div className={`${labelClass} mt-1.5`}>{t('typeMono')}</div>
            </div>
            <p className="ff-ui mt-1.5 mb-0 text-[13px] leading-[1.55] text-ink-mute">
              {t('note')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
