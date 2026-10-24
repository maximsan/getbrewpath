'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@shared/styles/cn';

import { AnswerFeedback } from './answer-feedback';

export interface Choice {
  key: string | number;
  label: string;
  /** Shown after the pick: the right answer turns green (--sage), a wrong pick turns red (--berry). */
  verdict?: 'correct' | 'incorrect';
  /** This is the choice the learner picked. */
  picked: boolean;
  onSelect: () => void;
}

/** How a choice looks once the learner has picked: the right answer green, a wrong pick red and shaking. */
const VERDICT_STYLE: Record<NonNullable<Choice['verdict']>, string> = {
  correct: 'border-sage bg-[color-mix(in_oklab,var(--sage)_12%,var(--surface))]',
  incorrect:
    'border-berry bg-[color-mix(in_oklab,var(--berry)_8%,var(--surface))] animate-answer-shake',
};

/** The colour a choice takes once the learner has picked: the right answer is correct, a wrong pick incorrect. */
export function choiceVerdict<T>(value: T, answer: T, picked: T | null): Choice['verdict'] {
  if (picked === null) {
    return undefined;
  }
  if (value === answer) {
    return 'correct';
  }

  return value === picked ? 'incorrect' : undefined;
}

interface ChoiceCardProps {
  cue: string;
  /** The question or statement, set in Fraunces at title size. */
  title: string;
  /** Tailwind line-height class for the title. */
  titleLeading: string;
  choices: Choice[];
  /** null until the learner picks; then whether the pick was right. */
  pickedCorrect: boolean | null;
  explain: string;
  onContinue?: () => void;
}

/** The shared layout of a one-pick card: cue, title, choices, verdict after the pick, and Continue. */
export function ChoiceCard({
  cue,
  title,
  titleLeading,
  choices,
  pickedCorrect,
  explain,
  onContinue,
}: ChoiceCardProps) {
  const translate = useTranslations('lesson');
  const answered = pickedCorrect !== null;

  return (
    <div className="flex min-h-[600px] flex-[1_0_auto] flex-col px-6">
      <div className="smallcaps mb-3 flex items-center gap-2 leading-none text-accent">
        <span className="text-support leading-none">{cue}</span>
      </div>
      <h2
        className={`ff-display m-0 text-title font-normal tracking-[-0.01em] text-pretty text-ink ${titleLeading}`}
      >
        {title}
      </h2>

      <div className="mt-6 flex flex-col gap-2.5">
        {choices.map((choice) => (
          <button
            key={choice.key}
            type="button"
            className={cn(
              'ff-ui block w-full cursor-pointer rounded-card border border-rule bg-surface px-5 py-[18px] text-left text-body font-medium text-ink transition-all duration-150 ease-[ease] not-disabled:active:scale-[.985] disabled:cursor-default',
              choice.verdict && VERDICT_STYLE[choice.verdict],
              // Only the learner's own pick moves: a right pick pops, but the right answer
              // revealed after a wrong pick stays still.
              choice.verdict === 'correct' && pickedCorrect && 'animate-answer-pop',
            )}
            disabled={answered}
            aria-pressed={choice.picked}
            onClick={choice.onSelect}
          >
            {choice.label}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {answered && <AnswerFeedback correct={pickedCorrect} text={explain} />}
      </div>

      <div className="flex-1" />
      <div className="pt-8">
        <button type="button" className="btn btn-primary" onClick={onContinue} disabled={!answered}>
          {translate('continue')}
        </button>
      </div>
    </div>
  );
}
