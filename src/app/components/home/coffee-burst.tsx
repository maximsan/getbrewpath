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
/** How many pieces of each kind one round of the burst holds. */
const KIND_COUNTS = { bean: 4, chaff: 6, steam: 3 } as const;

type Kind = keyof typeof KIND_COUNTS;
const ONE_ROUND = (Object.keys(KIND_COUNTS) as Kind[]).flatMap((kind) =>
  Array<Kind>(KIND_COUNTS[kind]).fill(kind),
);
/** The design file's burst size. */
const PIECE_COUNT = 22;
/** One full round, then the start of a second one. */
const PIECES = [...ONE_ROUND, ...ONE_ROUND].slice(0, PIECE_COUNT);

/** How far a piece flies, in px: at least the minimum, plus up to the spread. */
const MIN_DISTANCE_PX = 110;
const DISTANCE_SPREAD_PX = 120;
/** Lifts the whole burst, in px, so it reads as rising out of the card. */
const LIFT_PX = 60;
/** How far, in radians, a piece may stray from its even place round the circle. */
const ANGLE_JITTER_RAD = 0.6;
/** A piece spins up to half this many degrees, either way. */
const SPIN_RANGE_DEG = 540;
/** A flight lasts at least the minimum, plus up to the spread, in seconds. */
const MIN_FLIGHT_S = 0.9;
const FLIGHT_SPREAD_S = 0.6;
/** The latest a piece may set off, in seconds, so they don't all leave at once. */
const MAX_START_DELAY_S = 0.18;

const FULL_TURN = Math.PI * 2;

type PieceStyle = CSSProperties & Record<`--${string}`, string>;

/** A random number from -0.5 to 0.5, for an even spread either side of a value. */
const randomOffset = () => Math.random() - 1 / 2;

/** Spreads the pieces evenly round a circle, each with a little random angle, distance, spin and timing. */
function scatter() {
  return PIECES.map((kind, index) => {
    const angle = (FULL_TURN * index) / PIECES.length + randomOffset() * ANGLE_JITTER_RAD;
    const distance = MIN_DISTANCE_PX + Math.random() * DISTANCE_SPREAD_PX;
    const style: PieceStyle = {
      '--fly-x': `${Math.cos(angle) * distance}px`,
      '--fly-y': `${Math.sin(angle) * distance - LIFT_PX}px`,
      '--spin': `${randomOffset() * SPIN_RANGE_DEG}deg`,
      '--flight': `${MIN_FLIGHT_S + Math.random() * FLIGHT_SPREAD_S}s`,
      '--start-delay': `${Math.random() * MAX_START_DELAY_S}s`,
    };

    if (kind !== 'steam') {
      style.background = COLOURS[index % COLOURS.length];
    }

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
