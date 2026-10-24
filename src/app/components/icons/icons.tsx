import type { ReactNode, SVGProps } from 'react';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number };

const DEFAULT_SIZE = 28;

/** Line icons drawn on a 24-unit grid in `currentColor`, copied from the prototype. */
function icon(paths: ReactNode, viewBox = '0 0 24 24') {
  function Icon({ size = DEFAULT_SIZE, ...props }: IconProps) {
    return (
      <svg width={size} height={size} viewBox={viewBox} fill="none" aria-hidden {...props}>
        {paths}
      </svg>
    );
  }
  return Icon;
}

const line = { stroke: 'currentColor', strokeLinecap: 'round', strokeWidth: 1.6 } as const;

export const BeansIcon = icon(
  <>
    <path d="M11 4 Q12 9 9 12" {...line} />
    <circle cx="8" cy="15" r="4.2" {...line} />
    <circle cx="15.5" cy="14" r="4.2" {...line} />
  </>,
);

export const ProcessingIcon = icon(
  <>
    <path d="M13.6 5.9 Q 15.2 3.7 17.4 3.5" {...line} strokeWidth={1.3} />
    <circle cx="11.8" cy="13.2" r="7" {...line} />
    <ellipse
      cx="11.8"
      cy="13.2"
      rx="2.9"
      ry="4.2"
      transform="rotate(-18 11.8 13.2)"
      {...line}
      strokeWidth={1.3}
    />
  </>,
);

export const RoastingIcon = icon(
  <>
    <path d="M4.8 4.5 V19.2 H19.6" {...line} strokeWidth={1.3} opacity={0.55} />
    <path d="M6.2 17.2 Q 10 16.6 12.4 11.4 T 19.4 6.8" {...line} />
    <circle cx="12.4" cy="11.4" r="2" fill="currentColor" />
  </>,
);

export const GrindIcon = icon(
  <>
    <path
      d="M12 9.4 V6.6 H15.8 A1.7 1.7 0 0 1 15.8 10"
      {...line}
      strokeWidth={1.3}
      strokeLinejoin="round"
    />
    <path
      d="M7.6 9.4 H16.4 V18 A2.4 2.4 0 0 1 14 20.4 H10 A2.4 2.4 0 0 1 7.6 18 Z"
      {...line}
      strokeLinejoin="round"
    />
    <path d="M9.4 14.2 H14.6" {...line} strokeWidth={1.3} />
  </>,
);

export const BrewingIcon = icon(
  <>
    <path d="M6 6 H18 L13 14 H11 L6 6 Z" {...line} strokeLinejoin="round" />
    <path d="M12 16.5 v2.5" {...line} />
  </>,
);

export const CupIcon = icon(
  <>
    <path d="M9 3 Q10 4.5 9 6 Q8 7.5 9 9" {...line} strokeWidth={1.4} opacity={0.7} />
    <path d="M12 3 Q13 4.5 12 6 Q11 7.5 12 9" {...line} strokeWidth={1.4} opacity={0.7} />
    <path d="M15 3 Q16 4.5 15 6 Q14 7.5 15 9" {...line} strokeWidth={1.4} opacity={0.7} />
    <path
      d="M5 10.5 L19 10.5 L18 19 Q17.5 20.5 16 20.5 L8 20.5 Q6.5 20.5 6 19 Z"
      {...line}
      strokeLinejoin="round"
    />
    <path d="M19 12.5 Q22 12.5 22 15.5 Q22 18 19 18" {...line} />
  </>,
);

export const RouteIcon = icon(
  <>
    <path d="M4 20 Q8 18 9 14 Q10 8 14 7 Q18 6 20 4" {...line} strokeDasharray="0.1 3.4" />
    <circle cx="4" cy="20" r="2.1" {...line} />
    <circle cx="10" cy="13" r="2.1" {...line} />
    <circle cx="20" cy="4" r="2.4" {...line} />
  </>,
);

export const CardsIcon = icon(
  <>
    <rect x="5" y="6" width="11" height="14" rx="1.6" transform="rotate(-8 10.5 13)" {...line} />
    <rect x="8" y="5" width="11" height="14" rx="1.6" {...line} />
    <ellipse
      cx="13.5"
      cy="12"
      rx="1.7"
      ry="2.4"
      transform="rotate(-18 13.5 12)"
      {...line}
      strokeWidth={1.3}
    />
  </>,
);

export const LeafIcon = icon(
  <>
    <path
      d="M20 4 Q20 13 14 18 Q9 21 6 19 Q3 16 5 11 Q9 5 20 4 Z"
      {...line}
      strokeLinejoin="round"
    />
    <path d="M20 4 L7 18" {...line} strokeWidth={1.2} opacity={0.75} />
    <path d="M14 9 L11 11" {...line} strokeWidth={1} opacity={0.6} />
    <path d="M12 13 L8.5 14.5" {...line} strokeWidth={1} opacity={0.6} />
  </>,
);

export const CheckIcon = icon(
  <path d="M3 9.5l3.5 3.5L15 5" {...line} strokeWidth={2} strokeLinejoin="round" />,
  '0 0 18 18',
);

export const ShareIcon = icon(
  <>
    <path
      d="M10 13V3M10 3L6.5 6.5M10 3l3.5 3.5"
      {...line}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <path d="M5 11v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4" {...line} strokeWidth={1.7} />
  </>,
  '0 0 20 20',
);

export const DownloadIcon = icon(
  <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M3 13h10" {...line} strokeLinejoin="round" />,
  '0 0 16 16',
);
