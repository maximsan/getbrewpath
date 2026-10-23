'use client';

import { type CSSProperties, useState } from 'react';

import { cn } from '@shared/styles/cn';

import styles from './coffee-burst.module.css';

/** Roast colours, light to dark, then the paler tones of the chaff. */
const COLOURS = [
  'var(--art-roast-light)',
  'var(--art-roast-mid)',
  'var(--art-roast-deep)',
  'var(--art-roast-dark)',
  'var(--art-cherry-parchment)',
  'var(--art-cream)',
];
const KIND_COUNTS = { bean: 4, chaff: 6, steam: 3 } as const;
type Kind = keyof typeof KIND_COUNTS;
const ONE_ROUND = (Object.keys(KIND_COUNTS) as Kind[]).flatMap((kind) =>
  Array<Kind>(KIND_COUNTS[kind]).fill(kind),
);
/** The design file's burst: the round above, then its first nine pieces again. */
const PIECES = [...ONE_ROUND, ...ONE_ROUND].slice(0, 22);

const MIN_DISTANCE = 110;
const DISTANCE_SPREAD = 120;
/** Lifts the whole burst so it reads as rising out of the card. */
const LIFT = 60;

type PieceStyle = CSSProperties & Record<`--${string}`, string>;

/** Spreads the pieces evenly round a circle, each with a little random angle, distance, spin and timing. */
function scatter() {
  return PIECES.map((kind, index) => {
    const angle = (Math.PI * 2 * index) / PIECES.length + (Math.random() - 0.5) * 0.6;
    const distance = MIN_DISTANCE + Math.random() * DISTANCE_SPREAD;
    const style: PieceStyle = {
      '--x': `${Math.cos(angle) * distance}px`,
      '--y': `${Math.sin(angle) * distance - LIFT}px`,
      '--r': `${Math.random() * 540 - 270}deg`,
      '--d': `${0.9 + Math.random() * 0.6}s`,
      '--delay': `${Math.random() * 0.18}s`,
    };
    if (kind !== 'steam') style.background = COLOURS[index % COLOURS.length];
    return { kind, style };
  });
}

/** A one-off burst of beans, chaff and steam, played once when it mounts. */
export function CoffeeBurst() {
  const [pieces] = useState(scatter);

  return (
    <div aria-hidden className={styles.burst}>
      {pieces.map(({ kind, style }, index) => (
        <span
          key={index}
          className={cn(styles.piece, kind !== 'chaff' && styles[kind])}
          style={style}
        />
      ))}
    </div>
  );
}
