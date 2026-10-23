import { EMAIL_HI } from './site';

export type LegalDocId = 'terms' | 'privacy' | 'websitePrivacy';

/** One of the app's legal documents in `public/`, which a page's text is copied from. */
interface LegalFile {
  path: string;
  /**
   * Wording the page already changed while the file keeps the old one, until the owner updates the file.
   * https://github.com/maximsan/getbrewpath/issues/35 lists them.
   */
  pendingEdits: readonly { inFile: string; onPage: string }[];
}

interface LegalDocSource {
  /** The file the page copies, or null for the website's own notice, which exists only as a page. */
  file: LegalFile | null;
  /** The document's date: "Effective" for the Terms of Use, "Last updated" for the others. */
  date: string;
  /** The contact address the page gives. */
  email: string;
}

export const LEGAL_DOCS: Record<LegalDocId, LegalDocSource> = {
  terms: {
    file: { path: '/legal/BrewPath_Terms_of_Use.pdf', pendingEdits: [] },
    date: '2026-10-20',
    email: EMAIL_HI,
  },
  privacy: {
    file: {
      path: '/legal/BrewPath_Privacy_Policy.pdf',
      pendingEdits: [{ inFile: 'support@getbrewpath.com', onPage: EMAIL_HI }],
    },
    date: '2026-10-20',
    email: EMAIL_HI,
  },
  websitePrivacy: {
    file: null,
    date: '2026-10-23',
    email: EMAIL_HI,
  },
};

/** How the page writes a document's date, e.g. "October 20, 2026". */
export const LEGAL_DOC_DATE_FORMAT = { dateStyle: 'long', timeZone: 'UTC' } as const;
