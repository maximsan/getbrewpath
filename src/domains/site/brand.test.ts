import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { BRAND_COLORS } from './brand';

const GLOBALS_CSS = readFileSync('src/app/globals.css', 'utf8');

/** The CSS rules that set the colours: Cupping by default, and Dark Roast. */
const CUPPING_RULE = ':root {';
const DARK_ROAST_RULE = "[data-scheme='dark'],\n[data-mood='dark-roast'] {";

/** Where `globals.css` sets each brand colour: the rule, then the variable. */
const CSS_VARIABLE_OF: Record<keyof typeof BRAND_COLORS, [rule: string, variable: string]> = {
  paper: [CUPPING_RULE, '--bg'],
  ink: [CUPPING_RULE, '--ink'],
  inkMute: [CUPPING_RULE, '--ink-mute'],
  crema: [CUPPING_RULE, '--accent'],
  darkRoast: [DARK_ROAST_RULE, '--bg'],
  sage: [CUPPING_RULE, '--sage'],
  ripeCherry: [CUPPING_RULE, '--art-ripe'],
};

/** The value `rule` gives `variable` in `globals.css`, or undefined if it sets none. */
function cssValue(rule: string, variable: string) {
  const start = GLOBALS_CSS.indexOf(rule);
  if (start === -1) throw new Error(`globals.css has no rule ${rule}`);
  const body = GLOBALS_CSS.slice(start, GLOBALS_CSS.indexOf('}', start));
  return new RegExp(`${variable}:\\s*(?<value>#[0-9a-f]{6});`, 'i').exec(body)?.groups?.value;
}

describe('the brand colours', () => {
  it.each(Object.entries(CSS_VARIABLE_OF))(
    '%s matches its CSS variable in globals.css',
    (name, [rule, variable]) => {
      const color = BRAND_COLORS[name as keyof typeof BRAND_COLORS];
      expect(cssValue(rule, variable)?.toUpperCase()).toBe(color);
    },
  );
});
