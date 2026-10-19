'use client';

import { useTranslations } from 'next-intl';
import { useState, useSyncExternalStore } from 'react';

import { type Choice, ChoiceCard, choiceVerdict } from './choice-card';

export interface MCQChoice {
  /** The answer text. */
  t: string;
  /** Exactly one choice is correct. */
  correct?: boolean;
}

export interface MCQCardData {
  /** The question. */
  prompt: string;
  /** Three or four answers, shuffled on screen once per mount. */
  choices: MCQChoice[];
  /** Shown after any pick, under a right or wrong verdict. */
  explain: string;
}

export interface MCQCardProps {
  card: MCQCardData;
  /** Continue is enabled once an answer is picked. */
  onContinue?: () => void;
  /** Called once when the pick is the correct one. */
  onCorrect?: () => void;
}

/** Fisher–Yates over 0..n-1. */
function shuffledIndices(n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return order;
}

const subscribeNever = () => () => {};

/**
 * false on the server and during hydration, true after it, so the server HTML
 * and the first client render both show the authored order.
 */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

/** A multiple-choice card: cue, question, shuffled answers, feedback after one pick, and Continue. */
export function MCQCard({ card, onContinue, onCorrect }: MCQCardProps) {
  const t = useTranslations('lesson');
  const [picked, setPicked] = useState<number | null>(null);
  const [shuffled] = useState(() => shuffledIndices(card.choices.length));
  const hydrated = useHydrated();
  // Render order only: grading and feedback key off the authored index.
  const order = hydrated ? shuffled : card.choices.map((_, i) => i);
  const correctIndex = card.choices.findIndex((choice) => choice.correct);

  const pick = (index: number) => {
    if (picked !== null) return;
    setPicked(index);
    if (index === correctIndex) onCorrect?.();
  };

  const choices: Choice[] = order.map((index) => ({
    key: index,
    label: card.choices[index]?.t ?? '',
    picked: picked === index,
    verdict: choiceVerdict(index, correctIndex, picked),
    onSelect: () => pick(index),
  }));

  return (
    <ChoiceCard
      cue={t('cueMcq')}
      title={card.prompt}
      titleLeading="leading-[1.1]"
      choices={choices}
      pickedCorrect={picked === null ? null : picked === correctIndex}
      explain={card.explain}
      onContinue={onContinue}
    />
  );
}
