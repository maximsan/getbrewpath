'use client';

import { useState } from 'react';

import { Disclosure } from '@components/brewpath/disclosure/disclosure';

const NONE_OPEN = -1;

interface FaqListProps {
  entries: { question: string; answer: string }[];
}

/** The FAQ's questions, each opening to its answer. Opening one answer closes the one that was open. */
export function FaqList({ entries }: FaqListProps) {
  const [openIndex, setOpenIndex] = useState(NONE_OPEN);

  return entries.map(({ question, answer }, index) => (
    <Disclosure
      key={question}
      label={question}
      glyph="plus"
      headerClassName="py-5"
      // The design file's pace for an answer opening or closing.
      className="[--disclosure-ms:380ms]"
      open={openIndex === index}
      onToggle={() => setOpenIndex((current) => (current === index ? NONE_OPEN : index))}
    >
      <p className="ff-ui mt-0 mb-4.5 max-w-[60ch] text-[15px] leading-[1.65] text-pretty text-ink-mute">
        {answer}
      </p>
    </Disclosure>
  ));
}
