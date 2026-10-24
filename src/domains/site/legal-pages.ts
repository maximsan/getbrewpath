import { LEGAL_DOCS } from './legal-docs';
import type { LEGAL_PAGES } from './routes';
import { EMAIL_HI } from './site';

export type LegalPageName = (typeof LEGAL_PAGES)[number];

interface LegalPageSource {
  /** The PDF the page offers for download, or null when the page is the document's only copy. */
  file: string | null;
  date: string;
  /** The contact address the page gives. */
  email: string;
}

/**
 * The website privacy page's date and contact address. The page is the notice's only copy,
 * so it is not in `LEGAL_DOCS`, which lists the pages copied from the app's files.
 */
const WEBSITE_PRIVACY: LegalPageSource = { file: null, date: '2026-10-23', email: EMAIL_HI };

/** The date, contact address and downloadable PDF of the legal page `page`. */
export const legalPageSource = (page: LegalPageName): LegalPageSource =>
  page === 'websitePrivacy' ? WEBSITE_PRIVACY : LEGAL_DOCS[page];
