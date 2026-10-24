import { type CSSProperties, type ReactElement, useId } from 'react';

import styles from './roasty.module.css';

/** Each state has its own face and motion; idle, card, module and sleep loop, the rest play once. */
export type RoastyState =
  'idle' | 'correct' | 'wrong' | 'lesson' | 'module' | 'points' | 'card' | 'sleep' | 'awake';

export type RoastyRoast = 'light' | 'medium' | 'dark' | 'espresso';

export interface RoastyProps {
  /** Defaults to "idle". */
  state?: RoastyState;
  /** Width in px; the drawing is 1.4 times as tall. Defaults to 160. */
  size?: number;
  /** Changing this value replays the state's animation. */
  replayKey?: number | string;
  style?: CSSProperties;
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

/** Inline style that also sets the custom properties the keyframes read (--dx, --peak, …). */
type StyleWithVars = CSSProperties & Record<`--${string}`, string>;

const VIEW_WIDTH = 200;
const VIEW_HEIGHT = 280;
const HEIGHT_RATIO = VIEW_HEIGHT / VIEW_WIDTH;

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
/** Centre of the bean; the body and the module rays scale around it. */
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

function Faces() {
  return (
    <>
      <g className={styles.faceDefault}>
        <Eyes shape={ROUND_EYE} />
        <Blush cy={172} rx={6} ry={3} opacity={0.45} />
        <InkLine d="M 90 180 Q 100 188 110 180" width={2.5} />
      </g>

      <g className={styles.faceCorrect}>
        <HappyEyes />
        <Blush cy={170} rx={7} ry={3.5} opacity={0.55} />
        <InkLine d="M 86 178 Q 100 192 114 178" width={3} />
      </g>

      <g className={styles.faceWrong}>
        <Eyes shape={DOWNCAST_EYE} />
        <InkLine d="M 71 138 L 84 135" width={2} />
        <InkLine d="M 129 138 L 116 135" width={2} />
        <InkLine d="M 91 184 Q 100 180 109 184" width={2.5} />
        <Blush cy={174} rx={5} ry={2.5} opacity={0.3} />
      </g>

      <g className={styles.faceLesson}>
        <HappyEyes />
        <Blush cy={170} rx={7} ry={3.5} opacity={0.55} />
        <path d="M 84 178 Q 100 198 116 178 Q 100 188 84 178 Z" fill={INK} />
        <path d="M 92 186 Q 100 192 108 186 Q 100 190 92 186 Z" fill={BLUSH} opacity={0.7} />
      </g>

      <g className={styles.faceModule}>
        <path transform={`translate(${EYE_X.left} 148)`} d={STAR_PATH} fill="var(--warn)" />
        <path transform={`translate(${EYE_X.right} 148)`} d={STAR_PATH} fill="var(--warn)" />
        <Blush cy={172} rx={7} ry={3.5} opacity={0.55} />
        <ellipse cx={100} cy={185} rx={8} ry={9} fill={INK} />
        <ellipse cx={100} cy={188} rx={5} ry={4} fill={BLUSH} opacity={0.7} />
      </g>

      <g className={styles.facePoints}>
        <Eye cx={EYE_X.left} shape={ROUND_EYE} />
        <InkLine d="M 110 148 Q 120 142 130 148" width={3} />
        <Blush cy={170} rx={6} ry={3} opacity={0.5} />
        <InkLine d="M 90 180 Q 100 188 113 178" width={2.5} />
      </g>

      <g className={styles.faceCard}>
        <Eyes shape={WIDE_EYE} />
        <Blush cy={172} rx={7} ry={3.5} opacity={0.5} />
        <ellipse cx={100} cy={184} rx={5} ry={6} fill={INK} />
      </g>

      <g className={styles.faceSleep}>
        <InkLine d="M 71 150 L 89 150" width={3} />
        <InkLine d="M 111 150 L 129 150" width={3} />
        <Blush cy={172} rx={6} ry={3} opacity={0.35} />
        <InkLine d="M 95 182 Q 100 184 105 182" width={2.5} />
      </g>

      <g className={styles.faceAwake}>
        <Eyes shape={WIDEST_EYE} />
        <Blush cy={172} rx={6} ry={3} opacity={0.4} />
        <ellipse cx={100} cy={184} rx={4} ry={5} fill={INK} />
      </g>
    </>
  );
}

function Sprig({ leafFill }: { leafFill: string }) {
  return (
    <g className={styles.sproutGroup}>
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
  /** Horizontal drift, px. */
  dx: number;
  /** Highest point of the arc, px above the launch point. */
  peak: number;
  /** Where the fall ends, px below the launch point. */
  fall: number;
  /** Total rotation, deg. */
  spin: number;
  delayMs: number;
}

const FLAVOUR_NOTES: readonly FlavourNote[] = [
  { kind: 'berry', dx: -104, peak: -118, fall: 210, spin: -200, delayMs: 700 },
  { kind: 'citrus', dx: 96, peak: -126, fall: 220, spin: 237, delayMs: 730 },
  { kind: 'cocoa', dx: -62, peak: -140, fall: 200, spin: -274, delayMs: 760 },
  { kind: 'blossom', dx: 60, peak: -134, fall: 205, spin: 311, delayMs: 790 },
  { kind: 'caramel', dx: -20, peak: -150, fall: 190, spin: -348, delayMs: 740 },
  { kind: 'berry', dx: 22, peak: -146, fall: 195, spin: 385, delayMs: 820 },
  { kind: 'citrus', dx: -120, peak: -92, fall: 230, spin: -422, delayMs: 850 },
  { kind: 'cocoa', dx: 118, peak: -98, fall: 225, spin: 219, delayMs: 870 },
  { kind: 'blossom', dx: -84, peak: -110, fall: 215, spin: -256, delayMs: 900 },
  { kind: 'caramel', dx: 82, peak: -114, fall: 212, spin: 293, delayMs: 930 },
  { kind: 'berry', dx: -40, peak: -128, fall: 198, spin: -330, delayMs: 960 },
  { kind: 'citrus', dx: 42, peak: -122, fall: 202, spin: 367, delayMs: 980 },
  { kind: 'cocoa', dx: -8, peak: -136, fall: 206, spin: -404, delayMs: 1010 },
  { kind: 'blossom', dx: 10, peak: -108, fall: 218, spin: 201, delayMs: 1040 },
  { kind: 'caramel', dx: -96, peak: -76, fall: 240, spin: -238, delayMs: 1070 },
  { kind: 'berry', dx: 100, peak: -80, fall: 235, spin: 275, delayMs: 1100 },
];

function BeanBurst() {
  return (
    <g className={styles.beanBurst}>
      <g className={styles.heatGlow}>
        <circle cx={BEAN_CENTRE.x} cy={BEAN_CENTRE.y} r="74" fill="#E0A866" opacity="0.18" />
        <circle cx={BEAN_CENTRE.x} cy={BEAN_CENTRE.y} r="58" fill="#E8B87A" opacity="0.22" />
      </g>
      <g transform={`translate(${CRACK_ORIGIN.x} ${CRACK_ORIGIN.y})`}>
        <circle className={styles.crackRing} r="12" fill="none" stroke={CREAM} strokeWidth="3" />
        {CRACK_LINE_ANGLES.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              className={styles.crackLine}
              d="M0 -16 L0 -26"
              stroke={CREAM}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
      {FLAVOUR_NOTES.map((note, index) => {
        const delay = `${note.delayMs}ms`;
        const flyX: StyleWithVars = { '--dx': `${note.dx}px`, animationDelay: delay };
        const flyY: StyleWithVars = {
          '--peak': `${note.peak}px`,
          '--fall': `${note.fall}px`,
          animationDelay: delay,
        };
        const flutter: StyleWithVars = { '--spin': `${note.spin}deg`, animationDelay: delay };

        return (
          <g key={index} transform={`translate(${NOTE_ORIGIN.x} ${NOTE_ORIGIN.y})`}>
            <g className={styles.flyX} style={flyX}>
              <g className={styles.flyY} style={flyY}>
                <g className={styles.noteFlutter} style={flutter}>
                  {NOTE_ART[note.kind]}
                </g>
              </g>
            </g>
          </g>
        );
      })}
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
  /** How far each droplet travels diagonally when the bubble bursts, px. */
  spread: number;
  delayMs: number;
}

const CREMA_BUBBLES: readonly CremaBubble[] = [
  { x: 36, y: 82, r: 6, highlightOffset: 1.9, highlightR: 1.8, spread: 9.3, delayMs: 0 },
  { x: 168, y: 100, r: 5, highlightOffset: 1.6, highlightR: 1.5, spread: 7.8, delayMs: 140 },
  { x: 40, y: 198, r: 4.5, highlightOffset: 1.4, highlightR: 1.3, spread: 7, delayMs: 280 },
  { x: 170, y: 198, r: 6, highlightOffset: 1.9, highlightR: 1.8, spread: 9.3, delayMs: 420 },
];

/** Droplet directions as (x, y) signs: down-right, down-left, up-left, up-right. */
const DROP_DIRECTIONS = [
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, -1],
] as const;

const CREMA_EDGE = '#E8C08A';

function Crema() {
  return (
    <g className={styles.crema}>
      {CREMA_BUBBLES.map((bubble) => {
        const delay = { animationDelay: `${bubble.delayMs}ms` };

        return (
          <g key={`${bubble.x},${bubble.y}`} transform={`translate(${bubble.x} ${bubble.y})`}>
            <g className={styles.cremaBubble} style={delay}>
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
              className={styles.cremaPop}
              r={bubble.r}
              fill="none"
              stroke={CREMA_EDGE}
              strokeWidth="1.2"
              style={delay}
            />
            {DROP_DIRECTIONS.map(([signX, signY]) => {
              const drop: StyleWithVars = {
                '--dx': `${signX * bubble.spread}px`,
                '--dy': `${signY * bubble.spread}px`,
                ...delay,
              };

              return (
                <circle
                  key={`${signX},${signY}`}
                  className={styles.cremaDrop}
                  r="1"
                  fill={CREMA_EDGE}
                  style={drop}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

/** Unit on the points tag, as the app writes it in English. */
const POINTS_UNIT = 'PTS';

/** Roasty, the coffee-bean mascot. Decorative: hidden from assistive technology. */
export function Roasty({
  state = 'idle',
  size = 160,
  replayKey = 0,
  style,
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
      className={styles.wrap}
      style={{ width: size, height: size * HEIGHT_RATIO, ...style }}
    >
      <svg
        className={styles.roasty}
        data-state={state}
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
        {plate && (
          <circle cx="100" cy="140" r="112" fill={plate === true ? 'var(--roasty-plate)' : plate} />
        )}

        <g className={styles.cardGlow}>
          <ellipse cx="100" cy="160" rx="120" ry="110" fill={`url(#${glowGradientId})`} />
        </g>

        <g className={styles.moduleRays} opacity="0.3">
          <g fill="none" stroke="var(--warn)" strokeWidth="1.2" strokeLinecap="round">
            {MODULE_RAYS.map(([startX, startY, endX, endY]) => (
              <line key={`${startX},${startY}`} x1={startX} y1={startY} x2={endX} y2={endY} />
            ))}
          </g>
        </g>

        <BeanBurst />

        <g className={styles.bodyGroup}>
          <ellipse cx="100" cy="232" rx="56" ry="6" fill={CREASE} opacity="0.18" />

          {/* Bare-headed, the sprout sits behind the bean and moves with every hop. */}
          {hat === 'none' && showSprout && <Sprig leafFill={leafFill} />}

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

          <Faces />

          <g className={styles.wrongX} opacity="0.85">
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

          {hat === 'beanie' && <Beanie />}
          {/* With a hat on, the sprout grows up through it. */}
          {hat !== 'none' && showSprout && (
            <g transform={`translate(0 -${SPROUT_LIFT_UNDER_HAT})`}>
              <Sprig leafFill={leafFill} />
            </g>
          )}
        </g>

        <Crema />

        <g className={styles.pointsBurst}>
          <rect x="68" y="42" width="64" height="24" rx="2" fill="var(--accent)" />
          <text
            className={styles.pointsText}
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

        <g className={styles.sleepZzz} fontStyle="italic" fill="var(--ink-mute)">
          <text x="148" y="80" fontSize="18">
            z
          </text>
          <text x="158" y="68" fontSize="14">
            z
          </text>
          <text x="166" y="58" fontSize="11">
            z
          </text>
        </g>
      </svg>
    </span>
  );
}
