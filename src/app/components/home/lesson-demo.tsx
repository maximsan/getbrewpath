'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';

import { MCQCard, type MCQCardData } from '@components/brewpath/lesson-cards/mcq-card';
import {
  TrueFalseCard,
  type TrueFalseCardData,
} from '@components/brewpath/lesson-cards/true-false-card';
import { ProgressTopbar } from '@components/brewpath/progress-topbar/progress-topbar';
import { LockedRewardCard } from '@components/brewpath/reward-card/locked-reward-card';
import { Roasty } from '@components/brewpath/roasty/roasty';
import { RewardCard, type RewardCardData } from '@components/brewpath/reward-card/reward-card';
import { ButtonRow } from '@components/button-row/button-row';
import { AppDownloadLink, linkButtonClass } from '@components/link-button/link-button';
import { ScaledFrame } from '@components/scaled-frame/scaled-frame';
import { cn } from '@shared/styles/cn';
import { twoColumnClass } from '@components/section/section';

import { CoffeeBurst } from './coffee-burst';

/** The three cards of the demo, in order. */
const CARD_COUNT = 3;
const COMPLETION_HOLD_MS = 2000;

interface LessonDemoProps {
  /** The card a perfect run of lesson one earns. */
  reward?: RewardCardData;
  illustration?: string;
}

function focusHeading(heading: HTMLHeadingElement | null) {
  heading?.focus();
}

/** Three questions based on lesson one, playable in a phone frame. */
export function LessonDemo({ reward, illustration }: LessonDemoProps) {
  const translate = useTranslations('demo');
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  /** A new run number remounts the cards, so a replay starts with unanswered cards. */
  const [run, setRun] = useState(0);
  const [moreToRead, setMoreToRead] = useState(false);
  const scrollCueId = useId();
  const celebrationButton = useRef<HTMLButtonElement>(null);
  const [focusResult, setFocusResult] = useState(false);

  const celebrating = step === CARD_COUNT;
  const done = step > CARD_COUNT;
  const showReward = () => {
    setFocusResult(true);
    setStep(CARD_COUNT + 1);
  };

  useEffect(() => {
    if (!celebrating) {
      return;
    }

    celebrationButton.current?.focus();
    const timer = window.setTimeout(() => {
      setFocusResult(document.activeElement === celebrationButton.current);
      setStep(CARD_COUNT + 1);
    }, COMPLETION_HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [celebrating]);
  const perfect = score === CARD_COUNT;
  const rewardScore = perfect ? 'scorePerfect' : 'scorePartial';
  const next = () => setStep((current) => Math.min(current + 1, CARD_COUNT));
  const countCorrect = () => setScore((current) => current + 1);
  const restart = () => {
    setStep(0);
    setFocusResult(false);
    setScore(0);
    setMoreToRead(false);
    setRun((current) => current + 1);
  };

  const cards: [MCQCardData, TrueFalseCardData, MCQCardData] = [
    {
      prompt: translate('card0.prompt'),
      choices: [
        { text: translate('card0.choices.c1') },
        { text: translate('card0.choices.c2'), correct: true },
        { text: translate('card0.choices.c3') },
        { text: translate('card0.choices.c4') },
      ],
      explain: translate('card0.explain'),
    },
    { statement: translate('card1.statement'), answer: false, explain: translate('card1.explain') },
    {
      prompt: translate('card2.prompt'),
      choices: [
        { text: translate('card2.choices.c1') },
        { text: translate('card2.choices.c2'), correct: true },
        { text: translate('card2.choices.c3') },
        { text: translate('card2.choices.c4') },
      ],
      explain: translate('card2.explain'),
    },
  ];

  const progress = { cardNumber: Math.min(step, CARD_COUNT - 1) + 1, total: CARD_COUNT };

  return (
    <div className={twoColumnClass}>
      <div className="stacked:text-center">
        <h2 className="ff-display m-0 text-[clamp(28px,3.6vw,44px)] leading-[1.05] font-normal tracking-[-0.02em] text-balance">
          {translate('title')}
        </h2>
        <p className="ff-ui mt-4.5 mb-0 max-w-[46ch] text-base leading-[1.6] text-pretty text-ink-mute stacked:mx-auto">
          {translate('body')}
        </p>
        <div>
          {done ? (
            <div className="mt-7 flex animate-save-note-in flex-col gap-3 rounded-card border border-[color-mix(in_oklab,var(--sage)_50%,var(--rule))] bg-[color-mix(in_oklab,var(--sage)_10%,transparent)] px-5.5 py-5">
              <h3
                ref={focusResult ? focusHeading : undefined}
                tabIndex={-1}
                className="ff-display m-0 text-[22px] leading-[1.15] font-normal"
              >
                {translate(reward ? rewardScore : 'scoreOnly', {
                  correctAnswers: score,
                  total: CARD_COUNT,
                })}
              </h3>
              <div className="ff-ui text-sm/normal text-ink-mute">
                {reward && <>{translate(perfect ? 'scoreBodyPerfect' : 'scoreBodyPartial')} </>}
                {translate('fullLesson')}
              </div>
              <ButtonRow className="mt-1 gap-2.5 stacked:justify-center">
                <AppDownloadLink tone="accent" size="md">
                  {translate('get')}
                </AppDownloadLink>
                <button
                  type="button"
                  onClick={restart}
                  className={linkButtonClass('outline', 'md')}
                >
                  {translate('again')}
                </button>
              </ButtonRow>
            </div>
          ) : (
            <div
              aria-live="polite"
              className="ff-mono mt-7 flex items-center gap-2.5 text-[11px] leading-normal tracking-widest text-ink-mute uppercase stacked:justify-center"
            >
              <span className="size-1.5 flex-none animate-dot-pulse rounded-full bg-accent" />
              {celebrating ? translate('completed') : translate('progress', progress)}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        {done && perfect && reward && (
          <p
            id={scrollCueId}
            className={cn(
              'ff-ui mt-0 mb-3 text-center text-sm text-ink-mute',
              !moreToRead && 'invisible',
            )}
          >
            {translate('scrollReward')} <span aria-hidden="true">↓</span>
          </p>
        )}
        <ScaledFrame className="aspect-demo-phone w-full max-w-demo-phone">
          <div className="w-demo-phone flex-none rounded-[48px] bg-[#15100c] p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,255,255,.06)]">
            <div className="relative h-demo-screen-height w-demo-screen overflow-hidden rounded-[40px] bg-bg">
              <div className="absolute inset-x-0 top-0 z-3 flex h-11 items-center justify-center">
                <div className="h-6.5 w-24 rounded-full bg-[#0b0806]" />
              </div>
              {/* The app is drawn at its real size, then shrunk to the screen's width. */}
              <ScaledFrame className="absolute inset-0">
                <div key={run} className="relative h-demo-app-height w-demo-app overflow-hidden">
                  <ProgressTopbar
                    onClose={restart}
                    cardIndex={Math.min(step, CARD_COUNT - 1)}
                    total={CARD_COUNT}
                    done={celebrating || done}
                    closeLabel={translate('restart')}
                  />
                  <div className="absolute inset-0 flex flex-col pt-30 pb-8">
                    {step === 0 && (
                      <MCQCard
                        card={cards[0]}
                        focusTitle={run > 0 ? focusHeading : undefined}
                        onContinue={next}
                        onCorrect={countCorrect}
                      />
                    )}
                    {step === 1 && (
                      <TrueFalseCard
                        card={cards[1]}
                        focusTitle={focusHeading}
                        onContinue={next}
                        onCorrect={countCorrect}
                      />
                    )}
                    {step === 2 && (
                      <MCQCard
                        card={cards[2]}
                        focusTitle={focusHeading}
                        onContinue={next}
                        onCorrect={countCorrect}
                      />
                    )}
                    {celebrating && (
                      <button
                        ref={celebrationButton}
                        type="button"
                        onClick={showReward}
                        aria-label={translate('continueToResult')}
                        className="flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center gap-6 bg-transparent px-6 text-ink"
                      >
                        <Roasty size="large" state="lesson" />
                        <span className="ff-display text-title">{translate('completed')}</span>
                      </button>
                    )}
                    {done &&
                      reward &&
                      (perfect ? (
                        <>
                          <CoffeeBurst />
                          <EarnedReward
                            reward={reward}
                            illustration={illustration}
                            cueId={moreToRead ? scrollCueId : undefined}
                            onMoreToReadChange={setMoreToRead}
                          />
                        </>
                      ) : (
                        <div className="flex min-h-0 flex-1 animate-save-note-in flex-col px-6">
                          <div className="mx-auto flex min-h-0 w-full max-w-[320px] flex-1">
                            <LockedRewardCard
                              title={reward.title}
                              illustration={illustration}
                              onRetry={restart}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </ScaledFrame>
              <div
                data-demo-home-indicator
                className="absolute bottom-2 left-1/2 h-1 w-27.5 -translate-x-1/2 rounded-full bg-rule"
              />
            </div>
          </div>
        </ScaledFrame>
      </div>
    </div>
  );
}

function EarnedReward({
  reward,
  illustration,
  cueId,
  onMoreToReadChange,
}: {
  reward: RewardCardData;
  illustration?: string;
  cueId?: string;
  onMoreToReadChange: (moreToRead: boolean) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const region = viewport.current;
    const card = content.current;

    if (!region || !card) {
      return;
    }

    const updateCue = () => {
      onMoreToReadChange(region.scrollHeight - region.clientHeight - region.scrollTop > 1);
    };
    const observer = new ResizeObserver(updateCue);

    observer.observe(region);
    observer.observe(card);
    region.addEventListener('scroll', updateCue, { passive: true });
    updateCue();

    return () => {
      observer.disconnect();
      region.removeEventListener('scroll', updateCue);
    };
  }, [onMoreToReadChange]);

  return (
    <div
      ref={viewport}
      role="region"
      aria-label={reward.title}
      aria-describedby={cueId}
      tabIndex={0}
      className="min-h-0 animate-save-note-in scrollbar-none overflow-y-auto px-6 pb-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
    >
      <div ref={content} className="flex justify-center">
        <RewardCard reward={reward} illustration={illustration} />
      </div>
    </div>
  );
}
