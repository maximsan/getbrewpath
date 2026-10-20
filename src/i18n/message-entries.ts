/** Every string in a strings object, as its key path and text, e.g. ["faq.items.q1.a", "…"]. */
export const messageEntries = (value: unknown, prefix = ''): [string, string][] =>
  typeof value === 'object' && value !== null
    ? Object.entries(value).flatMap(([key, child]) => messageEntries(child, `${prefix}${key}.`))
    : [[prefix.slice(0, -1), String(value)]];
