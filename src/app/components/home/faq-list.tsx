'use client';

import { useState } from 'react';

import { Disclosure } from '@components/brewpath/disclosure/disclosure';

/** The design file's pace for an answer opening or closing. */
const ANSWER_MS = 380;
const NONE_OPEN = -1;

interface FaqListProps {
  items: { question: string; answer: string }[];
}

/** The FAQ's questions, each opening to its answer. Opening one answer closes the one that was open. */
export function FaqList({ items }: FaqListProps) {
  const [openIndex, setOpenIndex] = useState(NONE_OPEN);

  return items.map(({ question, answer }, index) => (
    <Disclosure
      key={question}
      label={question}
      glyph="plus"
      headerPad="20px 0"
      durationMs={ANSWER_MS}
      open={openIndex === index}
      onToggle={() => setOpenIndex((current) => (current === index ? NONE_OPEN : index))}
    >
      <p className="ff-ui mt-0 mb-[18px] max-w-[60ch] text-[15px] leading-[1.65] text-pretty text-ink-mute">
        {answer}
      </p>
    </Disclosure>
  ));
}
