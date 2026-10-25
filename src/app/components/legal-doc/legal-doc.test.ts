import { readFile } from 'node:fs/promises';

import { LEGAL_DOC_DATE_FORMAT, LEGAL_DOCS, type LegalDocId } from '@domains/site/legal-docs';
import { PHONE } from '@domains/site/site';
import site from '@messages/en/site.json';
import { createFormatter, createTranslator } from 'next-intl';
import { extractText, getDocumentProxy } from 'unpdf';
import { describe, expect, it } from 'vitest';

import { legalDocOutline } from './legal-doc-outline';

/** The header and footer printed on every page of the files, e.g. "Terms of Use | Effective October 20, 2026 | 1". */
const FILE_HEADERS_AND_FOOTERS = [
  /^BrewPath$/,
  /^Terms of Use \| Effective .* \| \d+$/,
  /^BrewPath \| Privacy Policy\s+Page \d+$/,
];
const BULLET = '•';

async function fileText(doc: LegalDocId) {
  const bytes = await readFile(`public${LEGAL_DOCS[doc].file}`);
  const { text } = await extractText(await getDocumentProxy(new Uint8Array(bytes)), {
    mergePages: true,
  });

  return text;
}

/**
 * The file's words as the page should show them: without its headers and footers, and with each
 * pending file edit applied. A hyphen that ends a line joins its word to the next.
 */
async function fileWords(doc: LegalDocId) {
  const text = LEGAL_DOCS[doc].pendingFileEdits.reduce(
    (edited, { inFile, onPage }) => edited.replaceAll(inFile, onPage),
    await fileText(doc),
  );

  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !FILE_HEADERS_AND_FOOTERS.some((pattern) => pattern.test(line)))
    .join(' ')
    .replace(/(\w-) (\w)/g, '$1$2')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * The page's words in the file's layout: the title and date, then each text the page shows.
 * The file numbers its sections "1." where the page shows "01", and marks list items with a bullet.
 */
function pageWords(doc: LegalDocId, titleInFile: string) {
  const translate = createTranslator({ locale: 'en', messages: site, namespace: `docs.${doc}` });
  const format = createFormatter({ locale: 'en' });
  const text = (key: string) =>
    // The key is built at run time, so TypeScript cannot check it.
    translate(key as Parameters<typeof translate>[0], {
      email: LEGAL_DOCS[doc].email,
      phone: PHONE,
    });
  const { introKeys, sections } = legalDocOutline(site.docs[doc]);
  const date = format.dateTime(new Date(LEGAL_DOCS[doc].date), LEGAL_DOC_DATE_FORMAT);

  return [
    titleInFile.replace('{title}', translate('title')),
    translate('dated', { date }),
    ...introKeys.map(text),
    ...sections.flatMap((section, index) => [
      `${index + 1}. ${text(section.headingKey)}`,
      ...section.blocks.flatMap((block) =>
        block.textKeys.map((key) => (block.kind === 'list' ? `${BULLET} ${text(key)}` : text(key))),
      ),
    ]),
  ]
    .join(' ')
    .split(/\s+/);
}

describe.each([
  // The Terms file puts the brand before the page's title.
  ['terms', 'BrewPath {title}'],
  ['privacy', '{title}'],
] as const)('the %s page', (doc, titleInFile) => {
  it('shows the file’s text word for word', async () => {
    expect(pageWords(doc, titleInFile)).toEqual(await fileWords(doc));
  });

  it('lists only pending file edits the file still needs', async () => {
    const text = await fileText(doc);

    for (const { inFile } of LEGAL_DOCS[doc].pendingFileEdits) {
      expect(text).toContain(inFile);
    }
  });
});
