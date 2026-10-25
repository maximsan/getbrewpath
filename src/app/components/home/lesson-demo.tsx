'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { MCQCard, type MCQCardData } from '@components/brewpath/lesson-cards/mcq-card';
import {
  TrueFalseCard,
  type TrueFalseCardData,
} from '@components/brewpath/lesson-cards/true-false-card';
import { ProgressTopbar } from '@components/brewpath/progress-topbar/progress-topbar';
import { RewardCard, type RewardCardData } from '@components/brewpath/reward-card/reward-card';
import { ButtonRow } from '@components/button-row/button-row';
import { linkButtonClass } from '@components/link-button/link-button';
import { ScaledFrame } from '@components/scaled-frame/scaled-frame';
import { twoColumnClass } from '@components/section/section';
import { APP_STORE_URL } from '@domains/site/site';

import { CoffeeBurst } from './coffee-burst';

/** The three cards of the demo, in order. */
const CARD_COUNT = 3;

interface LessonDemoProps {
  /** The card a perfect run of lesson one earns. */
  reward: RewardCardData;
  /** How many lessons are free, lesson one among them. */
  freeLessons: number;
}

/** Lesson one's first three cards, playable in a phone frame. */
export function LessonDemo({ reward, freeLessons }: LessonDemoProps) {
  const translate = useTranslations('demo');
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  /** A new run number remounts the cards, so a replay starts with unanswered cards. */
  const [run, setRun] = useState(0);

  const done = step >= CARD_COUNT;
  const perfect = score === CARD_COUNT;
  const next = () => setStep((current) => Math.min(current + 1, CARD_COUNT));
  const countCorrect = () => setScore((current) => current + 1);
  const restart = () => {
    setStep(0);
    setScore(0);
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

  const progress = { n: Math.min(step, CARD_COUNT - 1) + 1, total: CARD_COUNT };

  return (
    <div className={twoColumnClass}>
      <div className="stacked:text-center">
        <h2 className="ff-display m-0 text-[clamp(28px,3.6vw,44px)] leading-[1.05] font-normal tracking-[-0.02em] text-balance">
          {translate('title')}
        </h2>
        <p className="ff-ui mt-4.5 mb-0 max-w-[46ch] text-base leading-[1.6] text-pretty text-ink-mute stacked:mx-auto">
          {translate('body')}
        </p>
        <div aria-live="polite">
          {done ? (
            <div className="mt-7 flex animate-save-note-in flex-col gap-3 rounded-card border border-[color-mix(in_oklab,var(--sage)_50%,var(--rule))] bg-[color-mix(in_oklab,var(--sage)_10%,transparent)] px-5.5 py-5">
              <div className="ff-display text-[22px] leading-[1.15]">
                {translate(perfect ? 'scorePerfect' : 'scorePartial', {
                  n: score,
                  total: CARD_COUNT,
                })}
              </div>
              <div className="ff-ui text-sm/normal text-ink-mute">
                {translate(perfect ? 'scoreBodyPerfect' : 'scoreBodyPartial')}{' '}
                {translate('fullLesson', { freeLessons })}
              </div>
              <ButtonRow className="mt-1 gap-2.5 stacked:justify-center">
                <a href={APP_STORE_URL} className={linkButtonClass('accent', 'md')}>
                  {translate('get')}
                </a>
                <button
                  type="button"
                  onClick={restart}
                  className="ff-ui min-h-10.5 appearance-none rounded-full border border-rule bg-transparent px-4.5 py-2 text-sm leading-[1.15] font-medium text-ink"
                >
                  {translate('again')}
                </button>
              </ButtonRow>
            </div>
          ) : (
            <div className="ff-mono mt-7 flex items-center gap-2.5 text-[11px] leading-normal tracking-widest text-ink-mute uppercase stacked:justify-center">
              <span className="size-1.5 flex-none animate-dot-pulse rounded-full bg-accent" />
              {translate('progress', progress)}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
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
                    pos={Math.min(step, CARD_COUNT - 1)}
                    total={CARD_COUNT}
                    done={done}
                    closeLabel={translate('restart')}
                  />
                  <div className="absolute inset-0 flex flex-col pt-33.5">
                    {step === 0 && (
                      <MCQCard card={cards[0]} onContinue={next} onCorrect={countCorrect} />
                    )}
                    {step === 1 && (
                      <TrueFalseCard card={cards[1]} onContinue={next} onCorrect={countCorrect} />
                    )}
                    {step === 2 && (
                      <MCQCard card={cards[2]} onContinue={next} onCorrect={countCorrect} />
                    )}
                    {done && (
                      <>
                        <CoffeeBurst />
                        <div className="flex animate-save-note-in justify-center px-6">
                          <div className="flex w-full max-w-[320px] justify-center">
                            <RewardCard reward={reward} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </ScaledFrame>
              <div className="absolute bottom-2 left-1/2 h-1 w-27.5 -translate-x-1/2 rounded-full bg-rule" />
            </div>
          </div>
        </ScaledFrame>
      </div>
    </div>
  );
}
