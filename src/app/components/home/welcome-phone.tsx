'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { ScaledFrame } from '@components/scaled-frame/scaled-frame';

/** The phone is drawn at the app's screen size in points, plus its bezel, then shrunk to fit. */
const SCREEN_WIDTH = 393;
const SCREEN_HEIGHT = 852;
const BEZEL = 10;
const PHONE_WIDTH = SCREEN_WIDTH + 2 * BEZEL;
const PHONE_HEIGHT = SCREEN_HEIGHT + 2 * BEZEL;
const SHOWN_MAX_WIDTH = 200;

/**
 * The app's Welcome screen, rebuilt in HTML so it follows the header's mood switch.
 * Source: brewpath repo, lib/features/onboarding/presentation/welcome/welcome_screen.dart.
 */
export function WelcomePhone({ alt }: { alt: string }) {
  const t = useTranslations();

  return (
    <div
      role="img"
      aria-label={alt}
      data-rise=""
      className="flex w-full justify-center"
      style={{ ['--y' as string]: '30%' }}
    >
      <ScaledFrame width={PHONE_WIDTH} height={PHONE_HEIGHT} maxWidth={SHOWN_MAX_WIDTH}>
        <div
          className="rounded-[62px] bg-phone-frame shadow-[0_62px_124px_-41px_rgba(27,22,20,.5)]"
          style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT, padding: BEZEL }}
        >
          <div
            className="relative overflow-hidden rounded-[52px] bg-bg text-ink transition-colors duration-[450ms]"
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          >
            <StatusBar />
            <div className="absolute inset-0 flex flex-col px-6 pt-[118px] pb-[104px]">
              <div className="flex min-h-0 flex-1 items-end">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-r border border-rule bg-surface">
                  <Image
                    src="/images/seed-poster.jpg"
                    alt=""
                    fill
                    sizes="190px"
                    className="object-cover"
                  />
                  <span className="absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-scrim text-scrim-ink backdrop-blur-[8px]">
                    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden>
                      <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />
                      <path
                        d="M16 9l5 5M21 9l-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="smallcaps mt-7 text-accent!">{t('brand')}</div>
              <div className="ff-display mt-3.5 text-display leading-[1.1] font-normal tracking-[-0.01em] whitespace-pre-line text-ink">
                {t('hero.title')}
              </div>
              <div className="ff-ui mt-4 max-w-[330px] text-body leading-[1.55] text-ink-mute">
                {t('features.introBody')}
              </div>
            </div>
            <div className="ff-mono absolute inset-x-0 bottom-14 text-center text-label tracking-[.24em] text-ink-mute uppercase">
              {t('features.introCue')}
            </div>
            <div className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-ink opacity-35" />
          </div>
        </div>
      </ScaledFrame>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[54px] items-center justify-between ps-11 pe-[34px]">
      <span className="ff-ui text-[17px] font-semibold text-ink">9:41</span>
      <span className="absolute top-[11px] left-1/2 h-9 w-[124px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5 text-ink">
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden>
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="3"
            stroke="currentColor"
            fill="none"
            opacity=".5"
          />
          <rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor" />
          <rect x="24" y="4" width="1.5" height="4" rx=".75" fill="currentColor" opacity=".5" />
        </svg>
      </span>
    </div>
  );
}
