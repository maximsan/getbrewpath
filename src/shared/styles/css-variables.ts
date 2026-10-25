import type { CSSProperties } from 'react';

/** A `style` object of CSS variables, such as `--start-delay`, for classes to read. */
export type CssVariables = CSSProperties & Record<`--${string}`, string>;
