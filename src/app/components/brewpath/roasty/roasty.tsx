import { type ReactElement, useId } from 'react';

import { cn } from '@shared/styles/cn';

/**
 * Each state has its own face and motion. The body's motion loops when idle, on a card and
 * asleep, and plays once otherwise; in the module state the sprout keeps swaying.
 */
export type RoastyState =
  'idle' | 'correct' | 'wrong' | 'lesson' | 'module' | 'points' | 'card' | 'sleep' | 'awake';

export type RoastyRoast = 'light' | 'medium' | 'dark' | 'espresso';

/** His width in each place he appears. */
const ROASTY_WIDTH = {
  /** Beside a lesson card's verdict: 72px. */
  small: 'w-18',
  /** On the not-found page: 170px. */
  medium: 'w-[170px]',
  /** On the home page: 200px. */
  large: 'w-50',
} as const;

export type RoastySize = keyof typeof ROASTY_WIDTH;

export interface RoastyProps {
  /** Defaults to "idle". */
  state?: RoastyState;
  /** How wide he is drawn: see ROASTY_WIDTH. The drawing is 1.4 times as tall. */
  size: RoastySize;
  /** Changing this value replays the state's animation. */
  replayKey?: number | string;
  /** Bean colour. Defaults to "medium". */
  roast?: RoastyRoast;
  /** Defaults to "beanie". */
  hat?: 'none' | 'beanie';
  /** Nothing to wear yet; the prop exists so callers match the app's contract. */
  gear?: 'none';
  /** What grows on his head, through the hat when he wears one. Defaults to "sprig". */
  sprout?: 'sprig' | 'none';
  /** The number on the points state's tag. Defaults to 10. */
  pointsAmount?: number;
  /** A paper disc behind him, for dark or accent backgrounds. true uses the fixed paper tone; a string sets the colour. */
  plate?: boolean | string;
}

const VIEW_WIDTH = 200;
const VIEW_HEIGHT = 280;

/**
 * The paper disc behind Roasty is always this colour, never --surface: --surface turns dark
 * in the Dark Roast mood, and the brown bean would disappear against it.
 */
const PLATE_PAPER = '#FBF7EE';

/** His body's motion in each state. */
const BODY_MOTION: Record<RoastyState, string> = {
  idle: 'animate-roasty-breathe',
  correct: 'animate-roasty-hop',
  wrong: 'animate-roasty-shake',
  lesson: 'animate-roasty-heat-crack',
  module: 'animate-roasty-grow',
  points: '',
  card: 'animate-roasty-shimmer',
  sleep: 'animate-roasty-sleep-breathe',
  awake: 'animate-roasty-awake-pop',
};

/**
 * The sprout sways while he is awake and cheerful, stays still while he frowns, and is gone
 * while he sleeps. Scale and opacity both go to 0: at a small scale a stub of stem stays visible.
 */
const SPROUT_MOTION: Record<RoastyState, string> = {
  idle: 'animate-roasty-leaf-sway',
  correct: 'animate-roasty-leaf-sway',
  wrong: '',
  lesson: 'animate-roasty-leaf-sway',
  module: 'animate-roasty-leaf-sway',
  points: 'animate-roasty-leaf-sway',
  card: 'animate-roasty-leaf-sway',
  sleep: 'scale-0 opacity-0',
  awake: 'scale-0 opacity-0',
};

/** Scales and spins an SVG part around its own centre, as an HTML element would. */
const AROUND_OWN_CENTRE = 'transform-fill origin-center';
/**
 * The point his body and the module rays move around, as the app's design system sets it.
 * The class `transform-fill` measures this point from the top-left corner of each SVG
 * group's bounding box.
 */
const BODY_PIVOT = 'transform-fill origin-[100px_158px]';

/** Radial gradient stops (highlight, mid, edge) for each roast. */
const ROAST_STOPS: Record<RoastyRoast, readonly [string, string, string]> = {
  light: ['#C49A6C', '#A87B4F', '#855B36'],
  medium: ['#8C5634', '#6B3E22', '#4A2B19'],
  dark: ['#6E4329', '#4A2C19', '#2C190E'],
  espresso: ['#4A2E1C', '#2F1B10', '#180C06'],
};

const INK = '#2A1B12';
const EYE_WHITE = '#FBF7EE';
const BLUSH = '#C47654';
const CREASE = '#2F1A0E';
const STEM = '#5E7148';
const CREAM = 'var(--art-cream)';
const RIPE = 'var(--art-ripe)';

const EYE_X = { left: 80, right: 120 } as const;
const CHEEK_X = { left: 68, right: 132 } as const;
/** Centre of the bean, where the lesson state's heat glow sits. */
const BEAN_CENTRE = { x: 100, y: 158 } as const;
/** Where the first crack opens and the flavour notes launch from. */
const CRACK_ORIGIN = { x: 100, y: 150 } as const;
const NOTE_ORIGIN = { x: 100, y: 146 } as const;
/** The sprout rises by this much to clear the hat's brim. */
const SPROUT_LIFT_UNDER_HAT = 13;

const BEAN_PATH = `
  M 100 90
  C  62 90, 38 120, 38 158
  C  38 200, 64 226, 100 226
  C 136 226, 162 200, 162 158
  C 162 120, 138 90, 100 90 Z`;
const STAR_PATH = 'M 0 -11 L 3 -3 L 11 -3 L 5 2 L 7 10 L 0 5 L -7 10 L -5 2 L -11 -3 L -3 -3 Z';

interface EyeShape {
  white: { cy: number; rx: number; ry: number };
  pupil: { cy: number; rx: number; ry: number };
  /** Catch-light, offset right of the eye's centre. */
  glint?: { dx: number; cy: number; r: number };
}

const ROUND_EYE: EyeShape = {
  white: { cy: 148, rx: 10, ry: 12 },
  pupil: { cy: 151, rx: 5, ry: 6 },
  glint: { dx: 2, cy: 148, r: 1.7 },
};
const DOWNCAST_EYE: EyeShape = {
  white: { cy: 148, rx: 10, ry: 12 },
  pupil: { cy: 155, rx: 5, ry: 5 },
};
const WIDE_EYE: EyeShape = {
  white: { cy: 146, rx: 11, ry: 13 },
  pupil: { cy: 148, rx: 6, ry: 7 },
  glint: { dx: 3, cy: 145, r: 2 },
};
const WIDEST_EYE: EyeShape = { ...WIDE_EYE, white: { ...WIDE_EYE.white, ry: 14 } };

function Eye({ cx, shape }: { cx: number; shape: EyeShape }) {
  const { white, pupil, glint } = shape;

  return (
    <>
      <ellipse cx={cx} cy={white.cy} rx={white.rx} ry={white.ry} fill={EYE_WHITE} />
      <ellipse cx={cx} cy={pupil.cy} rx={pupil.rx} ry={pupil.ry} fill={INK} />
      {glint && <circle cx={cx + glint.dx} cy={glint.cy} r={glint.r} fill={EYE_WHITE} />}
    </>
  );
}

function Eyes({ shape }: { shape: EyeShape }) {
  return (
    <>
      <Eye cx={EYE_X.left} shape={shape} />
      <Eye cx={EYE_X.right} shape={shape} />
    </>
  );
}

/** Closed, smiling eyes: an upward arc over each eye. */
function HappyEyes() {
  return (
    <>
      <InkLine d="M 70 148 Q 80 138 90 148" width={3} />
      <InkLine d="M 110 148 Q 120 138 130 148" width={3} />
    </>
  );
}

function Blush({ cy, rx, ry, opacity }: { cy: number; rx: number; ry: number; opacity: number }) {
  return (
    <>
      <ellipse cx={CHEEK_X.left} cy={cy} rx={rx} ry={ry} fill={BLUSH} opacity={opacity} />
      <ellipse cx={CHEEK_X.right} cy={cy} rx={rx} ry={ry} fill={BLUSH} opacity={opacity} />
    </>
  );
}

function InkLine({ d, width }: { d: string; width: number }) {
  return <path d={d} stroke={INK} strokeWidth={width} strokeLinecap="round" fill="none" />;
}

/** His face in the given state. */
function Face({ state }: { state: RoastyState }) {
  switch (state) {
    case 'idle':
      return (
        <g>
          <Eyes shape={ROUND_EYE} />
          <Blush cy={172} rx={6} ry={3} opacity={0.45} />
          <InkLine d="M 90 180 Q 100 188 110 180" width={2.5} />
        </g>
      );
    case 'correct':
      return (
        <g>
          <HappyEyes />
          <Blush cy={170} rx={7} ry={3.5} opacity={0.55} />
          <InkLine d="M 86 178 Q 100 192 114 178" width={3} />
        </g>
      );
    case 'wrong':
      return (
        <g>
          <Eyes shape={DOWNCAST_EYE} />
          <InkLine d="M 71 138 L 84 135" width={2} />
          <InkLine d="M 129 138 L 116 135" width={2} />
          <InkLine d="M 91 184 Q 100 180 109 184" width={2.5} />
          <Blush cy={174} rx={5} ry={2.5} opacity={0.3} />
        </g>
      );
    case 'lesson':
      return (
        <g>
          <HappyEyes />
          <Blush cy={170} rx={7} ry={3.5} opacity={0.55} />
          <path d="M 84 178 Q 100 198 116 178 Q 100 188 84 178 Z" fill={INK} />
          <path d="M 92 186 Q 100 192 108 186 Q 100 190 92 186 Z" fill={BLUSH} opacity={0.7} />
        </g>
      );
    case 'module':
      return (
        <g>
          <path transform={`translate(${EYE_X.left} 148)`} d={STAR_PATH} fill="var(--warn)" />
          <path transform={`translate(${EYE_X.right} 148)`} d={STAR_PATH} fill="var(--warn)" />
          <Blush cy={172} rx={7} ry={3.5} opacity={0.55} />
          <ellipse cx={100} cy={185} rx={8} ry={9} fill={INK} />
          <ellipse cx={100} cy={188} rx={5} ry={4} fill={BLUSH} opacity={0.7} />
        </g>
      );
    case 'points':
      return (
        <g>
          <Eye cx={EYE_X.left} shape={ROUND_EYE} />
          <InkLine d="M 110 148 Q 120 142 130 148" width={3} />
          <Blush cy={170} rx={6} ry={3} opacity={0.5} />
          <InkLine d="M 90 180 Q 100 188 113 178" width={2.5} />
        </g>
      );
    case 'card':
      return (
        <g>
          <Eyes shape={WIDE_EYE} />
          <Blush cy={172} rx={7} ry={3.5} opacity={0.5} />
          <ellipse cx={100} cy={184} rx={5} ry={6} fill={INK} />
        </g>
      );
    case 'sleep':
      return (
        <g>
          <InkLine d="M 71 150 L 89 150" width={3} />
          <InkLine d="M 111 150 L 129 150" width={3} />
          <Blush cy={172} rx={6} ry={3} opacity={0.35} />
          <InkLine d="M 95 182 Q 100 184 105 182" width={2.5} />
        </g>
      );
    case 'awake':
      return (
        <g>
          <Eyes shape={WIDEST_EYE} />
          <Blush cy={172} rx={6} ry={3} opacity={0.4} />
          <ellipse cx={100} cy={184} rx={4} ry={5} fill={INK} />
        </g>
      );
  }
}

function Sprig({ leafFill, state }: { leafFill: string; state: RoastyState }) {
  return (
    <g className={cn('origin-bottom transform-fill', SPROUT_MOTION[state])}>
      <path
        d="M100 88 Q100 80 100 72"
        stroke={STEM}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M100 76 C 113 65, 127 67, 131 75 C 127 84, 111 82, 100 78 Z" fill={leafFill} />
      <path
        d="M100 77 Q 113 74, 127 76"
        stroke={STEM}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="91" cy="70" r="5.5" fill="#B8533A" />
      <circle cx="89" cy="68" r="1.8" fill="#E0997A" />
      <circle cx="99" cy="65" r="4.5" fill="#9E4632" />
    </g>
  );
}

function Beanie() {
  return (
    <g>
      <path d="M44 120 Q48 76 100 74 Q152 76 156 120 Z" fill="#B8533A" />
      <path d="M42 114 Q100 126 158 114 L158 129 Q100 140 42 129 Z" fill="#9E4632" />
      <path d="M66 96 Q100 89 134 96" stroke="#9E4632" strokeWidth="2" fill="none" opacity="0.55" />
      <path
        d="M64 105 Q100 98 136 105"
        stroke="#9E4632"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
    </g>
  );
}

const MODULE_RAYS = [
  [100, 40, 100, 60],
  [170, 70, 156, 84],
  [200, 158, 180, 158],
  [170, 230, 156, 216],
  [100, 250, 100, 230],
  [30, 230, 44, 216],
  [0, 158, 20, 158],
  [30, 70, 44, 84],
] as const;

const CRACK_LINE_ANGLES = [0, 60, 120, 180, 240, 300] as const;

/** Flavour notes from the coffee tasting wheel, thrown out at the first crack. */
const NOTE_ART = {
  berry: (
    <>
      <circle cx="-2.4" cy="1.4" r="2.6" fill="#8E2F4A" />
      <circle cx="2.4" cy="1.4" r="2.6" fill="#A8365A" />
      <circle cx="0" cy="-2.2" r="2.6" fill="#B8406A" />
      <path
        d="M-1 -5 L0 -6.6 L1 -5"
        stroke={STEM}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
  citrus: (
    <>
      <circle r="5.2" fill="#F2C14E" />
      <circle r="4" fill="#F7D97A" />
      <path d="M0 -4 L0 4 M-3.5 -2 L3.5 2 M-3.5 2 L3.5 -2" stroke="#F2C14E" strokeWidth="0.9" />
    </>
  ),
  cocoa: (
    <>
      <rect x="-4.6" y="-4.6" width="9.2" height="9.2" rx="1.6" fill="#5A3220" />
      <path d="M0 -4.6 L0 4.6 M-4.6 0 L4.6 0" stroke="#7A4A30" strokeWidth="1" />
    </>
  ),
  blossom: (
    <>
      <path d="M0 -6 C 4 -3, 4 3, 0 6 C -4 3, -4 -3, 0 -6 Z" fill="#F6EEDD" />
      <path d="M0 -3.4 L0 3.4" stroke="#E8D49A" strokeWidth="0.9" strokeLinecap="round" />
    </>
  ),
  caramel: (
    <>
      <path
        d="M0 -6 C 3 -1.5, 4.6 1.4, 4.6 2.6 A 4.6 4.6 0 0 1 -4.6 2.6 C -4.6 1.4, -3 -1.5, 0 -6 Z"
        fill={RIPE}
      />
      <ellipse cx="-1.4" cy="2" rx="1.2" ry="1.6" fill="#E3B070" opacity="0.8" />
    </>
  ),
};

interface FlavourNote {
  kind: keyof typeof NOTE_ART;
  /**
   * Its flight, as CSS variables the animations read: the horizontal drift, the arc's
   * highest point above the launch point, where the fall ends below it, the total spin,
   * and when it sets off.
   */
  flight: string;
}

const FLAVOUR_NOTES: readonly FlavourNote[] = [
  {
    kind: 'berry',
    flight:
      '[--drift:-104px] [--peak:-118px] [--fall:210px] [--note-spin:-200deg] [--start-delay:700ms]',
  },
  {
    kind: 'citrus',
    flight:
      '[--drift:96px] [--peak:-126px] [--fall:220px] [--note-spin:237deg] [--start-delay:730ms]',
  },
  {
    kind: 'cocoa',
    flight:
      '[--drift:-62px] [--peak:-140px] [--fall:200px] [--note-spin:-274deg] [--start-delay:760ms]',
  },
  {
    kind: 'blossom',
    flight:
      '[--drift:60px] [--peak:-134px] [--fall:205px] [--note-spin:311deg] [--start-delay:790ms]',
  },
  {
    kind: 'caramel',
    flight:
      '[--drift:-20px] [--peak:-150px] [--fall:190px] [--note-spin:-348deg] [--start-delay:740ms]',
  },
  {
    kind: 'berry',
    flight:
      '[--drift:22px] [--peak:-146px] [--fall:195px] [--note-spin:385deg] [--start-delay:820ms]',
  },
  {
    kind: 'citrus',
    flight:
      '[--drift:-120px] [--peak:-92px] [--fall:230px] [--note-spin:-422deg] [--start-delay:850ms]',
  },
  {
    kind: 'cocoa',
    flight:
      '[--drift:118px] [--peak:-98px] [--fall:225px] [--note-spin:219deg] [--start-delay:870ms]',
  },
  {
    kind: 'blossom',
    flight:
      '[--drift:-84px] [--peak:-110px] [--fall:215px] [--note-spin:-256deg] [--start-delay:900ms]',
  },
  {
    kind: 'caramel',
    flight:
      '[--drift:82px] [--peak:-114px] [--fall:212px] [--note-spin:293deg] [--start-delay:930ms]',
  },
  {
    kind: 'berry',
    flight:
      '[--drift:-40px] [--peak:-128px] [--fall:198px] [--note-spin:-330deg] [--start-delay:960ms]',
  },
  {
    kind: 'citrus',
    flight:
      '[--drift:42px] [--peak:-122px] [--fall:202px] [--note-spin:367deg] [--start-delay:980ms]',
  },
  {
    kind: 'cocoa',
    flight:
      '[--drift:-8px] [--peak:-136px] [--fall:206px] [--note-spin:-404deg] [--start-delay:1010ms]',
  },
  {
    kind: 'blossom',
    flight:
      '[--drift:10px] [--peak:-108px] [--fall:218px] [--note-spin:201deg] [--start-delay:1040ms]',
  },
  {
    kind: 'caramel',
    flight:
      '[--drift:-96px] [--peak:-76px] [--fall:240px] [--note-spin:-238deg] [--start-delay:1070ms]',
  },
  {
    kind: 'berry',
    flight:
      '[--drift:100px] [--peak:-80px] [--fall:235px] [--note-spin:275deg] [--start-delay:1100ms]',
  },
];

/** The lesson state's first crack: a heat glow, a ring and lines, then flavour notes thrown out. */
function BeanBurst() {
  return (
    <g>
      <g className={cn(AROUND_OWN_CENTRE, 'animate-roasty-heat-glow')}>
        <circle cx={BEAN_CENTRE.x} cy={BEAN_CENTRE.y} r="74" fill="#E0A866" opacity="0.18" />
        <circle cx={BEAN_CENTRE.x} cy={BEAN_CENTRE.y} r="58" fill="#E8B87A" opacity="0.22" />
      </g>
      <g transform={`translate(${CRACK_ORIGIN.x} ${CRACK_ORIGIN.y})`}>
        <circle
          className={cn(AROUND_OWN_CENTRE, 'animate-roasty-crack-ring')}
          r="12"
          fill="none"
          stroke={CREAM}
          strokeWidth="3"
        />
        {CRACK_LINE_ANGLES.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              className="origin-bottom animate-roasty-crack-line transform-fill"
              d="M0 -16 L0 -26"
              stroke={CREAM}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
      {/* Each note's variables sit on its outer group; the three nested animations inherit them. */}
      {FLAVOUR_NOTES.map((note, index) => (
        <g
          key={index}
          className={note.flight}
          transform={`translate(${NOTE_ORIGIN.x} ${NOTE_ORIGIN.y})`}
        >
          <g className="animate-roasty-fly-x">
            <g className="animate-roasty-fly-y">
              <g className={cn(AROUND_OWN_CENTRE, 'animate-roasty-note-flutter')}>
                {NOTE_ART[note.kind]}
              </g>
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}

interface CremaBubble {
  x: number;
  y: number;
  r: number;
  /** The highlight sits up-left of the centre by this much on both axes. */
  highlightOffset: number;
  highlightR: number;
  /**
   * Its timing, as CSS variables the animations read: how far each droplet travels
   * diagonally when the bubble bursts, and when the bubble starts.
   */
  timing: string;
}

const CREMA_BUBBLES: readonly CremaBubble[] = [
  {
    x: 36,
    y: 82,
    r: 6,
    highlightOffset: 1.9,
    highlightR: 1.8,
    timing: '[--spread:9.3px] [--start-delay:0ms]',
  },
  {
    x: 168,
    y: 100,
    r: 5,
    highlightOffset: 1.6,
    highlightR: 1.5,
    timing: '[--spread:7.8px] [--start-delay:140ms]',
  },
  {
    x: 40,
    y: 198,
    r: 4.5,
    highlightOffset: 1.4,
    highlightR: 1.3,
    timing: '[--spread:7px] [--start-delay:280ms]',
  },
  {
    x: 170,
    y: 198,
    r: 6,
    highlightOffset: 1.9,
    highlightR: 1.8,
    timing: '[--spread:9.3px] [--start-delay:420ms]',
  },
];

/** Droplet directions, as the signs the drop animation multiplies --spread by. */
const DROP_DIRECTIONS = [
  { name: 'down-right', signs: '[--drop-sign-x:1] [--drop-sign-y:1]' },
  { name: 'down-left', signs: '[--drop-sign-x:-1] [--drop-sign-y:1]' },
  { name: 'up-left', signs: '[--drop-sign-x:-1] [--drop-sign-y:-1]' },
  { name: 'up-right', signs: '[--drop-sign-x:1] [--drop-sign-y:-1]' },
] as const;

const CREMA_EDGE = '#E8C08A';

/** The correct state's crema bubbles: each swells, wobbles and bursts into droplets. */
function Crema() {
  return (
    <g>
      {/* Each bubble's variables sit on its group; the swell, pop and droplets inherit them. */}
      {CREMA_BUBBLES.map((bubble) => (
        <g
          key={`${bubble.x},${bubble.y}`}
          className={bubble.timing}
          transform={`translate(${bubble.x} ${bubble.y})`}
        >
          <g className={cn(AROUND_OWN_CENTRE, 'animate-roasty-crema-swell')}>
            <circle r={bubble.r} fill="#E3B070" opacity="0.85" />
            <circle
              cx={-bubble.highlightOffset}
              cy={-bubble.highlightOffset}
              r={bubble.highlightR}
              fill="#FFF3DC"
              opacity="0.9"
            />
          </g>
          <circle
            className={cn(AROUND_OWN_CENTRE, 'animate-roasty-crema-pop')}
            r={bubble.r}
            fill="none"
            stroke={CREMA_EDGE}
            strokeWidth="1.2"
          />
          {DROP_DIRECTIONS.map((direction) => (
            <circle
              key={direction.name}
              className={cn(AROUND_OWN_CENTRE, 'animate-roasty-crema-drop', direction.signs)}
              r="1"
              fill={CREMA_EDGE}
            />
          ))}
        </g>
      ))}
    </g>
  );
}

/** Unit on the points tag, as the app writes it in English. */
const POINTS_UNIT = 'PTS';

/** The sleep state's three z's, rising one after another. */
const SLEEP_ZS = [
  { x: 148, y: 80, fontSize: 18, start: '[--start-delay:0ms]' },
  { x: 158, y: 68, fontSize: 14, start: '[--start-delay:600ms]' },
  { x: 166, y: 58, fontSize: 11, start: '[--start-delay:1200ms]' },
] as const;

/** Roasty, the coffee-bean mascot. Decorative: hidden from assistive technology. */
export function Roasty({
  state = 'idle',
  size,
  replayKey = 0,
  roast = 'medium',
  hat = 'beanie',
  sprout = 'sprig',
  pointsAmount = 10,
  plate,
}: RoastyProps): ReactElement {
  const id = useId();
  const beanGradientId = `${id}-bean`;
  const leafGradientId = `${id}-leaf`;
  const glowGradientId = `${id}-glow`;
  const [highlight, mid, edge] = ROAST_STOPS[roast];
  const leafFill = `url(#${leafGradientId})`;
  const showSprout = sprout === 'sprig';

  return (
    // A new key remounts the drawing, which restarts its one-shot CSS animations.
    <span
      key={`${state}:${replayKey}`}
      className={cn('inline-block leading-0', ROASTY_WIDTH[size])}
    >
      {/* With its width set and its height left to the browser, the SVG takes the viewBox's shape. */}
      <svg
        className="block h-auto w-full overflow-visible"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        focusable="false"
      >
        <defs>
          <radialGradient id={beanGradientId} cx="32%" cy="32%" r="75%">
            <stop offset="0%" stopColor={highlight} />
            <stop offset="55%" stopColor={mid} />
            <stop offset="100%" stopColor={edge} />
          </radialGradient>
          <radialGradient id={leafGradientId} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#B5C497" />
            <stop offset="100%" stopColor={STEM} />
          </radialGradient>
          <radialGradient id={glowGradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E6C68A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E6C68A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* r clears the contact shadow under the bean. */}
        {plate && <circle cx="100" cy="140" r="112" fill={plate === true ? PLATE_PAPER : plate} />}

        {state === 'card' && (
          <ellipse cx="100" cy="160" rx="120" ry="110" fill={`url(#${glowGradientId})`} />
        )}

        {state === 'module' && (
          <g className={cn(BODY_PIVOT, 'animate-roasty-ray-radiate')} opacity="0.3">
            <g fill="none" stroke="var(--warn)" strokeWidth="1.2" strokeLinecap="round">
              {MODULE_RAYS.map(([startX, startY, endX, endY]) => (
                <line key={`${startX},${startY}`} x1={startX} y1={startY} x2={endX} y2={endY} />
              ))}
            </g>
          </g>
        )}

        {state === 'lesson' && <BeanBurst />}

        <g className={cn(BODY_PIVOT, BODY_MOTION[state])}>
          <ellipse cx="100" cy="232" rx="56" ry="6" fill={CREASE} opacity="0.18" />

          {/* Bare-headed, the sprout sits behind the bean and moves with every hop. */}
          {hat === 'none' && showSprout && <Sprig leafFill={leafFill} state={state} />}

          <path d={BEAN_PATH} fill={`url(#${beanGradientId})`} />
          <ellipse cx="78" cy="115" rx="22" ry="14" fill="#A26945" opacity="0.45" />
          <path
            d="M 100 96 Q 88 130, 100 158 Q 112 186, 100 218"
            stroke={CREASE}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />

          <Face state={state} />

          {state === 'wrong' && (
            <g opacity="0.85">
              <circle
                cx="148"
                cy="76"
                r="13"
                fill={EYE_WHITE}
                stroke="var(--berry)"
                strokeWidth="2"
              />
              <rect x="146" y="68" width="4" height="9" rx="1" fill="var(--berry)" />
              <circle cx="148" cy="82" r="1.6" fill="var(--berry)" />
            </g>
          )}

          {hat === 'beanie' && <Beanie />}
          {/* With a hat on, the sprout grows up through it. */}
          {hat !== 'none' && showSprout && (
            <g transform={`translate(0 -${SPROUT_LIFT_UNDER_HAT})`}>
              <Sprig leafFill={leafFill} state={state} />
            </g>
          )}
        </g>

        {state === 'correct' && <Crema />}

        {state === 'points' && (
          <g className="animate-roasty-points-rise">
            <rect x="68" y="42" width="64" height="24" rx="2" fill="var(--accent)" />
            <text
              className="ff-mono"
              x="100"
              y="59"
              textAnchor="middle"
              fontSize="13"
              fontWeight="500"
              fill="var(--accent-ink)"
              letterSpacing="1"
            >
              +{pointsAmount} {POINTS_UNIT}
            </text>
          </g>
        )}

        {state === 'sleep' && (
          <g className="ff-display" fontStyle="italic" fill="var(--ink-mute)">
            {SLEEP_ZS.map((sleepZ) => (
              <text
                key={sleepZ.start}
                className={cn('animate-roasty-zzz-float', sleepZ.start)}
                x={sleepZ.x}
                y={sleepZ.y}
                fontSize={sleepZ.fontSize}
              >
                z
              </text>
            ))}
          </g>
        )}
      </svg>
    </span>
  );
}
