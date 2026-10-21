import { readFile } from 'node:fs/promises';

import site from '@messages/en/site.json';
import { createTranslator } from 'next-intl';
import { extractText, getDocumentProxy } from 'unpdf';
import { describe, expect, it } from 'vitest';

import { LEGAL_DOCS, type LegalDocId } from './legal-docs';
import { PHONE } from './site';

/** The page headers and footers each file repeats, e.g. "Terms of Use | Effective October 20, 2026 | 1". */
const PAGE_FURNITURE = [
  /^BrewPath$/,
  /^Terms of Use \| Effective .* \| \d+$/,
  /^BrewPath \| Privacy Policy\s+Page \d+$/,
];
/** The page draws list bullets itself. */
const BULLET = '•';

/** The file's words, without page headers, footers and bullets. A hyphen that ends a line joins its word to the next. */
async function fileWords(doc: LegalDocId) {
  const bytes = await readFile(`public${LEGAL_DOCS[doc].file}`);
  const { text } = await extractText(await getDocumentProxy(new Uint8Array(bytes)), {
    mergePages: true,
  });
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !PAGE_FURNITURE.some((pattern) => pattern.test(line)));
  return lines
    .join(' ')
    .replace(/(\w-) (\w)/g, '$1$2')
    .split(/\s+/)
    .filter((word) => word && word !== BULLET);
}

/** The page's words in reading order, as `LegalDoc` renders them. */
function pageWords(doc: LegalDocId) {
  const t = createTranslator({ locale: 'en', messages: site, namespace: `docs.${doc}` });
  const text = (key: string) =>
    // Keys are read from the messages themselves, which TypeScript cannot follow.
    t(key as Parameters<typeof t>[0], { email: LEGAL_DOCS[doc].email, phone: PHONE });
  const { intro, sections } = site.docs[doc];
  const leaves = (value: object, prefix: string): string[] =>
    Object.entries(value).flatMap(([key, child]) =>
      typeof child === 'string' ? [text(`${prefix}.${key}`)] : leaves(child, `${prefix}.${key}`),
    );
  const parts = [
    ...leaves(intro, 'intro'),
    ...Object.entries(sections).flatMap(([key, section], index) => [
      `${index + 1}. ${section.h}`,
      ...leaves(section.blocks, `sections.${key}.blocks`),
    ]),
  ];
  return parts.join(' ').split(/\s+/);
}

const longDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' });

describe.each([
  ['terms', 'BrewPath Terms of Use Effective date:'],
  ['privacy', 'Privacy Policy Last updated:'],
] as const)('the %s page', (doc, heading) => {
  it('shows the file’s text word for word', async () => {
    const words = await fileWords(doc);
    const headingWords = `${heading} ${longDate(LEGAL_DOCS[doc].date)}`.split(' ');

    expect(words.slice(0, headingWords.length).join(' ')).toBe(headingWords.join(' '));
    expect(pageWords(doc)).toEqual(words.slice(headingWords.length));
  });
});
