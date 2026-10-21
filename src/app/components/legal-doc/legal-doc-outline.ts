/**
 * The kinds of block a legal document's section is made of: a paragraph (`p`), a
 * subheading (`h`), a bulleted list (`list`) or lines printed one under another (`lines`).
 */
const BLOCK_KINDS = ['p', 'h', 'list', 'lines'] as const;

export type BlockKind = (typeof BLOCK_KINDS)[number];

export interface OutlineBlock {
  id: string;
  kind: BlockKind;
  /** Keys of the block's texts inside the document: one for `p` and `h`, one per item for `list` and `lines`. */
  textKeys: string[];
}

export interface OutlineSection {
  id: string;
  headingKey: string;
  blocks: OutlineBlock[];
}

export interface LegalDocOutline {
  introKeys: string[];
  sections: OutlineSection[];
}

/** A legal document's part of `site.json`. */
interface LegalDocMessages {
  intro: Record<string, string>;
  sections: Record<string, { h: string; blocks: Record<string, object> }>;
}

/**
 * The keys of a legal document's texts, in reading order. The page and its test both read
 * the document through this, so a block the page cannot show fails both.
 */
export function legalDocOutline(messages: LegalDocMessages): LegalDocOutline {
  return {
    introKeys: Object.keys(messages.intro).map((key) => `intro.${key}`),
    sections: Object.entries(messages.sections).map(([id, section]) => ({
      id,
      headingKey: `sections.${id}.h`,
      blocks: Object.entries(section.blocks).map(([blockId, block]) =>
        outlineBlock(`sections.${id}.blocks.${blockId}`, blockId, block),
      ),
    })),
  };
}

function outlineBlock(path: string, id: string, block: object): OutlineBlock {
  const [field, ...extra] = Object.entries(block) as [string, unknown][];
  if (field && extra.length === 0) {
    const [kind, value] = field;
    if ((kind === 'p' || kind === 'h') && typeof value === 'string') {
      return { id, kind, textKeys: [`${path}.${kind}`] };
    }
    if ((kind === 'list' || kind === 'lines') && typeof value === 'object' && value !== null) {
      return { id, kind, textKeys: Object.keys(value).map((item) => `${path}.${kind}.${item}`) };
    }
  }
  throw new Error(`${path} must hold exactly one of ${BLOCK_KINDS.join(', ')}`);
}
