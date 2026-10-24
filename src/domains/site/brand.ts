/** The product name, as written everywhere: one word. */
export const BRAND_NAME = 'BrewPath';

/**
 * The brand colours as literal values, for drawings made outside the page's CSS,
 * such as the share images and the browser bar. The page itself reads the same
 * colours from the CSS variables in `src/app/globals.css`; `brand.test.ts` checks
 * both files hold the same values.
 */
export const BRAND_COLORS = {
  paper: '#F4EFE6',
  ink: '#1B1614',
  /** Secondary text in Cupping. Dark Roast has its own, lighter value. */
  inkMute: '#6B5F54',
  crema: '#A6462F',
  darkRoast: '#1A130E',
  sage: '#5F6E55',
  ripeCherry: '#C8843A',
} as const;
