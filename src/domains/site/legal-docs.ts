import { EMAIL_HI } from './site';

export type LegalDocId = 'terms' | 'privacy';

interface LegalDocSource {
  /** The app's legal document in `public/`, which the page's text is copied from. */
  file: string;
  /** The date the file gives: "Effective" for the Terms of Use, "Last updated" for the Privacy Policy. */
  date: string;
  /** The contact address the page gives. */
  email: string;
  /** Wording the page changed before the owner updated the file: `inFile` is the old wording, `onPage` the new. */
  pendingFileEdits: readonly { inFile: string; onPage: string }[];
}

export const LEGAL_DOCS: Record<LegalDocId, LegalDocSource> = {
  terms: {
    file: '/legal/BrewPath_Terms_of_Use.pdf',
    date: '2026-10-20',
    email: EMAIL_HI,
    pendingFileEdits: [],
  },
  privacy: {
    file: '/legal/BrewPath_Privacy_Policy.pdf',
    date: '2026-10-23',
    email: EMAIL_HI,
    pendingFileEdits: [],
  },
};

/** How the page writes a document's date, e.g. "October 20, 2026". */
export const LEGAL_DOC_DATE_FORMAT = { dateStyle: 'long', timeZone: 'UTC' } as const;
