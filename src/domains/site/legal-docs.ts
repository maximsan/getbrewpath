import { EMAIL_HI, EMAIL_SUPPORT } from './site';

export type LegalDocId = 'terms' | 'privacy';

interface LegalDocSource {
  /** The signed-off file in `public/` that the page's text is copied from. */
  file: string;
  /** The date the file gives: "Effective" for the Terms of Use, "Last updated" for the Privacy Policy. */
  date: string;
  /** The contact address the file gives. */
  email: string;
}

export const LEGAL_DOCS: Record<LegalDocId, LegalDocSource> = {
  terms: { file: '/legal/BrewPath_Terms_of_Use.pdf', date: '2026-10-20', email: EMAIL_HI },
  privacy: { file: '/legal/BrewPath_Privacy_Policy.pdf', date: '2026-10-20', email: EMAIL_SUPPORT },
};
