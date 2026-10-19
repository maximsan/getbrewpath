const STAMP_SIZE = 68;
const STAMP_ROTATION_DEG = -12;
const OUTER_RING_INSET = 2;
const RING_GAP = 8;
const BEAN_TILT_DEG = -18;

const radius = STAMP_SIZE / 2;
const outerRing = radius - OUTER_RING_INSET;
const innerRing = outerRing - RING_GAP;

/** The bean crease: an S-curve through the bean's centre, scaled to the inner ring. */
const creasePath = (() => {
  const tip = innerRing * 0.7;
  const bend = innerRing * 0.18;
  const shoulder = innerRing * 0.35;
  const neck = innerRing * 0.05;
  return `M 0 ${-tip} C ${bend} ${-shoulder}, ${-bend} ${-neck}, 0 0 S ${bend} ${shoulder}, 0 ${tip}`;
})();

/** The hand-stamp mark in the reward card's corner: two rings around a coffee bean. */
export function FlavorStamp() {
  return (
    <svg
      width={STAMP_SIZE}
      height={STAMP_SIZE}
      viewBox={`0 0 ${STAMP_SIZE} ${STAMP_SIZE}`}
      aria-hidden="true"
      className="block"
      style={{ transform: `rotate(${STAMP_ROTATION_DEG}deg)` }}
    >
      <circle
        cx={radius}
        cy={radius}
        r={outerRing}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.4"
      />
      <circle
        cx={radius}
        cy={radius}
        r={innerRing}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <g transform={`translate(${radius} ${radius}) rotate(${BEAN_TILT_DEG})`}>
        <ellipse
          cx="0"
          cy="0"
          rx={innerRing * 0.55}
          ry={innerRing * 0.78}
          fill="var(--accent)"
          fillOpacity="0.85"
          stroke="var(--accent)"
          strokeWidth="1"
        />
        <path
          d={creasePath}
          fill="none"
          stroke="var(--surface)"
          strokeOpacity="0.6"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
