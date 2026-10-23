/** The site's standalone pages. Card pages are listed by the course. */
export const PAGE_ROUTES = {
  home: '/',
  terms: '/terms',
  privacy: '/privacy',
  websitePrivacy: '/privacy/website',
} as const;

export type PageName = keyof typeof PAGE_ROUTES;

/** The legal pages, in the order the footer and the phone menu list them. */
export const LEGAL_PAGES = [
  'terms',
  'privacy',
  'websitePrivacy',
] as const satisfies readonly PageName[];
