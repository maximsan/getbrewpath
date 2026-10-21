// Locale registry + formatting helpers for the BrewPath site.
// Add a language: create i18n/<code>.js exporting the same shape as en.js, then register it in LOCALES.
const LOCALES = { en: () => import('./en.js') };

export const available = () => Object.keys(LOCALES).concat('pseudo');

export async function load(code) {
  if (code === 'pseudo') return pseudo((await LOCALES.en()).default);
  const loader = LOCALES[code] || LOCALES[(code || '').split('-')[0]] || LOCALES.en;
  return (await loader()).default;
}

// Pseudo-locale: accents every letter and pads ~35% so untranslated strings and tight layouts show up. Placeholders survive.
const MAP = { a: 'á', b: 'ƀ', c: 'ç', d: 'ð', e: 'é', f: 'ƒ', g: 'ĝ', h: 'ĥ', i: 'í', j: 'ĵ', k: 'ķ', l: 'ļ', m: 'ɱ', n: 'ñ', o: 'ö', p: 'þ', q: ' q', r: 'ŕ', s: 'š', t: 'ţ', u: 'ü', v: 'ṽ', w: 'ŵ', x: 'ẋ', y: 'ý', z: 'ž', A: 'Á', B: 'Ɓ', C: 'Ç', D: 'Ð', E: 'É', F: 'Ƒ', G: 'Ĝ', H: 'Ĥ', I: 'Í', J: 'Ĵ', K: 'Ķ', L: 'Ļ', M: 'Ṁ', N: 'Ñ', O: 'Ö', P: 'Þ', Q: 'Q', R: 'Ŕ', S: 'Š', T: 'Ţ', U: 'Ü', V: 'Ṽ', W: 'Ŵ', X: 'Ẋ', Y: 'Ý', Z: 'Ž' };
function pseudoStr(s) {
  if (!s) return s;
  const out = s.split(/(\{[^}]+\})/g).map(seg => seg.startsWith('{') ? seg : seg.replace(/[A-Za-z]/g, ch => MAP[ch] || ch)).join('');
  const pad = Math.ceil(s.replace(/\{[^}]+\}/g, '').length * 0.35 / 2);
  return '[' + out + ' ' + '~'.repeat(pad) + ']';
}
export function pseudo(obj) {
  if (typeof obj === 'string') return pseudoStr(obj);
  if (Array.isArray(obj)) return obj.map(pseudo);
  if (obj && typeof obj === 'object') {
    const o = {};
    for (const k of Object.keys(obj)) o[k] = k === 'meta' ? { ...obj[k], lang: 'en-XA' } : pseudo(obj[k]);
    return o;
  }
  return obj;
}

// Formatting
export function fmt(str, vars) {
  if (typeof str !== 'string') return '';
  return str.replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? String(vars[k]) : m));
}
export function plural(lang, forms, n, vars) {
  if (!forms) return '';
  const cat = new Intl.PluralRules(lang).select(n);
  return fmt(forms[cat] || forms.other, { n: num(lang, n), ...vars });
}
export const num = (lang, n, opts) => new Intl.NumberFormat(lang, opts).format(n);
export const money = (lang, n, currency, opts) => new Intl.NumberFormat(lang, { style: 'currency', currency, ...(Number.isInteger(n) ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : {}), ...opts }).format(n);
export const date = (lang, iso) => new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));
