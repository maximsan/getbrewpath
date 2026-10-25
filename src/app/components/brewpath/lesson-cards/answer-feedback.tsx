'use client';

import { useTranslations } from 'next-intl';

import { Roasty } from '@components/brewpath/roasty/roasty';
import { cn } from '@shared/styles/cn';

export interface AnswerFeedbackProps {
  /** true shows Roasty's happy face and a green "CORRECT"; false shows his wince and a red "NOT QUITE". */
  correct: boolean;
  /** The explanation under the verdict. */
  text: string;
}

/** The verdict under an answered card: Roasty reacting, a mono label, then the explanation. */
export function AnswerFeedback({ correct, text }: AnswerFeedbackProps) {
  const translate = useTranslations('lesson');

  return (
    // The verdict rises in after the pick reacts, so the pop or shake reads first.
    <div className="mt-5.5 flex animate-feedback-rise items-center gap-3.5">
      <div className="shrink-0">
        <Roasty state={correct ? 'correct' : 'wrong'} size="small" />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'ff-mono mb-2 text-label font-medium tracking-[0.14em] uppercase',
            correct ? 'text-sage' : 'text-berry',
          )}
        >
          {correct ? translate('correct') : translate('notQuite')}
        </div>
        <p className="m-0 text-support/normal text-pretty text-ink-mute">{text}</p>
      </div>
    </div>
  );
}
