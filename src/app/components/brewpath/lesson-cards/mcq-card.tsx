'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useHydrated } from '@shared/hooks/use-hydrated';

import { type Choice, ChoiceCard, choiceVerdict } from './choice-card';

export interface MCQChoice {
  /** The answer text. */
  text: string;
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

/** The indices 0 to `count` - 1 in a random order (a Fisher–Yates shuffle). */
function shuffledIndices(count: number): number[] {
  const order = Array.from({ length: count }, (_, i) => i);

  for (let i = order.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1));

    [order[i], order[swapIndex]] = [order[swapIndex]!, order[i]!];
  }

  return order;
}

/** A multiple-choice card: cue, question, shuffled answers, feedback after one pick, and Continue. */
export function MCQCard({ card, onContinue, onCorrect }: MCQCardProps) {
  const translate = useTranslations('lesson');
  const [picked, setPicked] = useState<number | null>(null);
  const [shuffled] = useState(() => shuffledIndices(card.choices.length));
  const hydrated = useHydrated();
  // The shuffle changes display order only; grading uses each answer's written position.
  const order = hydrated ? shuffled : card.choices.map((_, i) => i);
  const correctIndex = card.choices.findIndex((choice) => choice.correct);

  const pick = (index: number) => {
    if (picked !== null) {
      return;
    }
    setPicked(index);
    if (index === correctIndex) {
      onCorrect?.();
    }
  };

  const choices: Choice[] = order.map((index) => ({
    key: index,
    label: card.choices[index]?.text ?? '',
    picked: picked === index,
    verdict: choiceVerdict(index, correctIndex, picked),
    onSelect: () => pick(index),
  }));

  return (
    <ChoiceCard
      cue={translate('cueMcq')}
      title={card.prompt}
      titleLeading="leading-[1.1]"
      choices={choices}
      pickedCorrect={picked === null ? null : picked === correctIndex}
      explain={card.explain}
      onContinue={onContinue}
    />
  );
}
