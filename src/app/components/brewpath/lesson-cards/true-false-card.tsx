'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { type Choice, ChoiceCard, choiceVerdict } from './choice-card';

export interface TrueFalseCardData {
  /** The claim to judge. */
  statement: string;
  /** Whether the statement is true. */
  answer: boolean;
  /** Shown after either pick, under a right or wrong verdict. */
  explain: string;
}

export interface TrueFalseCardProps {
  card: TrueFalseCardData;
  /** Continue is enabled once True or False is picked. */
  onContinue?: () => void;
  /** Called once when the pick is the right one. */
  onCorrect?: () => void;
}

const ANSWERS = [true, false] as const;

/** A true-or-false card: cue, statement, True and False buttons, feedback after one pick, and Continue. */
export function TrueFalseCard({ card, onContinue, onCorrect }: TrueFalseCardProps) {
  const translate = useTranslations('lesson');
  const [picked, setPicked] = useState<boolean | null>(null);

  const pick = (value: boolean) => {
    if (picked !== null) {
      return;
    }
    setPicked(value);
    if (value === card.answer) {
      onCorrect?.();
    }
  };

  const choices: Choice[] = ANSWERS.map((value) => ({
    key: String(value),
    label: value ? translate('true') : translate('false'),
    picked: picked === value,
    verdict: choiceVerdict(value, card.answer, picked),
    onSelect: () => pick(value),
  }));

  return (
    <ChoiceCard
      cue={translate('cueTrueFalse')}
      title={card.statement}
      titleLeading="leading-[1.18]"
      choices={choices}
      pickedCorrect={picked === null ? null : picked === card.answer}
      explain={card.explain}
      onContinue={onContinue}
    />
  );
}
