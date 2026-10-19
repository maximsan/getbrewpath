'use client';

import { useTranslations } from 'next-intl';

import { Roasty } from '@components/brewpath/roasty/roasty';

import styles from './lesson-cards.module.css';

/** Roasty's size in lesson cards, in px. */
const ROASTY_SIZE = 72;

export interface AnswerFeedbackProps {
  /** true shows Roasty's correct face and a sage "CORRECT"; false his wrong face and a berry "NOT QUITE". */
  correct: boolean;
  /** The explanation under the verdict. */
  text: string;
}

/** The verdict under an answered card: Roasty reacting, a mono label, then the explanation. */
export function AnswerFeedback({ correct, text }: AnswerFeedbackProps) {
  const t = useTranslations('lesson');
  return (
    <div className={`${styles.feedbackRise} mt-[22px] flex items-center gap-3.5`}>
      <div className="shrink-0">
        <Roasty state={correct ? 'correct' : 'wrong'} size={ROASTY_SIZE} />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={`ff-mono mb-2 text-label font-medium tracking-[0.14em] uppercase ${correct ? 'text-sage' : 'text-berry'}`}
        >
          {correct ? t('correct') : t('notQuite')}
        </div>
        <p className="m-0 text-support leading-normal text-pretty text-ink-mute">{text}</p>
      </div>
    </div>
  );
}
