'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';

import coffeeTree from '@assets/demo-coffee-tree.png';
import { MCQCard, type MCQCardData } from '@components/brewpath/lesson-cards/mcq-card';
import {
  TrueFalseCard,
  type TrueFalseCardData,
} from '@components/brewpath/lesson-cards/true-false-card';
import { ProgressTopbar } from '@components/brewpath/progress-topbar/progress-topbar';
import { Roasty } from '@components/brewpath/roasty/roasty';
import { RewardCard, type RewardCardData } from '@components/brewpath/reward-card/reward-card';
import { AppDownloadLink } from '@components/link-button/link-button';
import { ScaledFrame } from '@components/scaled-frame/scaled-frame';
import { twoColumnClass } from '@components/section/section';
import { cn } from '@shared/styles/cn';

import { CoffeeBurst } from './coffee-burst';

/** The three cards of the demo, in order. */
const CARD_COUNT = 3;
/** The step after the last card: Roasty's "Lesson complete" screen. */
const CELEBRATION_STEP = CARD_COUNT;
/** The step after the celebration: the lesson result. */
const RESULT_STEP = CARD_COUNT + 1;
const COMPLETION_HOLD_MS = 3000;

interface LessonDemoProps {
  /** The card a perfect run of lesson one earns. */
  reward?: RewardCardData;
}

/** A ref callback that moves keyboard focus to the element when it mounts. */
function focusOnMount(element: HTMLElement | null) {
  element?.focus();
}

/** Three questions based on lesson one, playable in a phone frame. */
export function LessonDemo({ reward }: LessonDemoProps) {
  const translate = useTranslations('demo');
  const translateReward = useTranslations('reward');
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  /** A new run number remounts the cards, so a replay starts with unanswered cards. */
  const [run, setRun] = useState(0);
  const [cardOpen, setCardOpen] = useState(false);
  const [hasOpenedCard, setHasOpenedCard] = useState(false);
  const [moreToRead, setMoreToRead] = useState(false);
  const scrollHintId = useId();
  const resultCountId = useId();
  const celebrationButton = useRef<HTMLButtonElement>(null);
  const [focusResult, setFocusResult] = useState(false);

  const celebrating = step === CELEBRATION_STEP;
  const showingResult = step === RESULT_STEP;
  const showReward = () => {
    setFocusResult(true);
    setStep(RESULT_STEP);
  };

  useEffect(() => {
    if (!celebrating) {
      return;
    }

    celebrationButton.current?.focus();
    const timer = window.setTimeout(() => {
      setFocusResult(document.activeElement === celebrationButton.current);
      setStep(RESULT_STEP);
    }, COMPLETION_HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [celebrating]);
  const perfect = score === CARD_COUNT;
  const scoreMessage = perfect ? 'scorePerfect' : 'scorePartial';
  const readingCard = showingResult && perfect && reward && cardOpen;
  const backToResult = () => {
    setCardOpen(false);
    setHasOpenedCard(true);
    setMoreToRead(false);
  };
  const openCard = () => {
    setCardOpen(true);
  };
  const next = () => setStep((current) => Math.min(current + 1, CELEBRATION_STEP));
  const countCorrect = () => setScore((current) => current + 1);
  const restart = () => {
    setStep(0);
    setCardOpen(false);
    setHasOpenedCard(false);
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
          {showingResult ? (
            <div className="mt-7 flex animate-save-note-in flex-col gap-3 rounded-card border border-[color-mix(in_oklab,var(--sage)_50%,var(--rule))] bg-[color-mix(in_oklab,var(--sage)_10%,transparent)] px-5.5 py-5">
              <h3 className="ff-display m-0 text-[22px] leading-[1.15] font-normal">
                {translate(reward ? scoreMessage : 'scoreOnly', {
                  correctAnswers: score,
                  total: CARD_COUNT,
                })}
              </h3>
              <div className="ff-ui text-sm/normal text-ink-mute">
                {reward && <>{translate(perfect ? 'scoreBodyPerfect' : 'scoreBodyPartial')} </>}
                {translate('fullLesson')}
              </div>
              <div className="mt-1 flex stacked:justify-center">
                <AppDownloadLink tone="accent" size="md">
                  {translate('get')}
                </AppDownloadLink>
              </div>
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
      <div className="relative flex justify-center">
        {/* Placed outside the layout, so showing it never moves the phone. */}
        {readingCard && (
          <p
            id={scrollHintId}
            className={cn(
              'ff-ui absolute inset-x-0 bottom-full mt-0 mb-3 text-center text-sm text-ink-mute',
              !moreToRead && 'invisible',
            )}
          >
            {translate('scrollHint')} <span aria-hidden="true">↓</span>
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
                  {readingCard ? (
                    <button
                      ref={focusOnMount}
                      type="button"
                      aria-label={translate('backToResult')}
                      onClick={backToResult}
                      className="absolute top-status-bar left-3 z-10 flex size-11 items-center justify-center rounded-full text-ink"
                    >
                      <svg
                        aria-hidden="true"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="m15 5-7 7 7 7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ) : !showingResult ? (
                    <ProgressTopbar
                      onClose={restart}
                      cardIndex={Math.min(step, CARD_COUNT - 1)}
                      total={CARD_COUNT}
                      done={celebrating}
                      closeLabel={translate('restart')}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex flex-col pt-30 pb-8">
                    {step === 0 && (
                      <MCQCard
                        card={cards[0]}
                        focusTitle={run > 0 ? focusOnMount : undefined}
                        onContinue={next}
                        onCorrect={countCorrect}
                      />
                    )}
                    {step === 1 && (
                      <TrueFalseCard
                        card={cards[1]}
                        focusTitle={focusOnMount}
                        onContinue={next}
                        onCorrect={countCorrect}
                      />
                    )}
                    {step === 2 && (
                      <MCQCard
                        card={cards[2]}
                        focusTitle={focusOnMount}
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
                    {readingCard && (
                      <>
                        {!hasOpenedCard && <CoffeeBurst />}
                        <EarnedReward
                          reward={reward}
                          scrollHintId={moreToRead ? scrollHintId : undefined}
                          onMoreToReadChange={setMoreToRead}
                        />
                      </>
                    )}
                    {showingResult && !readingCard && (
                      <div className="flex min-h-0 flex-1 flex-col px-6">
                        <div className="min-h-0 flex-1 scrollbar-none overflow-y-auto px-1 pt-3 pb-4">
                          <div className="flex min-h-full flex-col gap-8">
                            <div className="text-center">
                              <h2
                                ref={focusResult && !hasOpenedCard ? focusOnMount : undefined}
                                tabIndex={-1}
                                aria-describedby={resultCountId}
                                className="ff-display m-0 text-title/tight font-normal text-balance"
                              >
                                {translate('lessonTitle')}
                              </h2>
                              <p
                                id={resultCountId}
                                className="ff-mono mt-3 mb-0 text-body text-ink-mute"
                              >
                                {translate('resultCount', {
                                  correctAnswers: score,
                                  total: CARD_COUNT,
                                })}
                              </p>
                            </div>
                            <div className="flex flex-1 items-center justify-center">
                              <Image
                                src={coffeeTree}
                                alt=""
                                sizes="180px"
                                className="size-60 object-contain"
                              />
                            </div>
                            {reward &&
                              (perfect ? (
                                <button
                                  ref={hasOpenedCard ? focusOnMount : undefined}
                                  type="button"
                                  onClick={openCard}
                                  className="ff-ui mt-auto flex w-full items-center justify-between gap-4 rounded-card border border-rule bg-surface px-4 py-3 text-left text-body"
                                >
                                  <span className="flex flex-col gap-1">
                                    <span className="font-medium text-ink">
                                      {translate('earnedCard')}
                                    </span>
                                    <span className="text-ink-mute">{reward.title}</span>
                                  </span>
                                  <span
                                    aria-hidden="true"
                                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 14 10" fill="none">
                                      <path
                                        d="M1.25 5h10.5M8.6 1.9L11.75 5 8.6 8.1"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </span>
                                </button>
                              ) : (
                                <p className="ff-ui mx-0 mt-auto mb-0 text-center text-body/normal text-pretty text-ink-mute">
                                  {translateReward('earnCard')}
                                </p>
                              ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={restart}
                          className="btn btn-primary shrink-0"
                        >
                          {translate('again')}
                        </button>
                      </div>
                    )}
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

interface EarnedRewardProps {
  reward: RewardCardData;
  /** The id of the scroll hint above the phone, while there is more of the card to read. */
  scrollHintId?: string;
  onMoreToReadChange: (moreToRead: boolean) => void;
}

/** The earned Coffee Card inside the phone, scrollable when it is taller than the screen. */
function EarnedReward({ reward, scrollHintId, onMoreToReadChange }: EarnedRewardProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const region = viewport.current;
    const card = content.current;

    if (!region || !card) {
      return;
    }

    const updateCue = () => {
      setScrolled(region.scrollTop > 1);
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
    <div className="relative flex min-h-0 flex-1 flex-col">
      {scrolled && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-bg/65 mask-[linear-gradient(black,transparent)] backdrop-blur-sm"
        />
      )}
      <div
        ref={viewport}
        role="region"
        aria-label={reward.title}
        aria-describedby={scrollHintId}
        tabIndex={0}
        className="min-h-0 flex-1 animate-save-note-in scrollbar-none overflow-y-auto px-6 pb-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        <div ref={content} className="flex min-h-full items-center justify-center py-3">
          <RewardCard reward={reward} />
        </div>
      </div>
    </div>
  );
}
