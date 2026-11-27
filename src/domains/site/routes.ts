/** The site's standalone pages. Card pages are listed by the course. */
export const PAGE_ROUTES = {
  home: '/',
  terms: '/terms',
  privacy: '/privacy',
  websitePrivacy: '/privacy/website',
} as const;

export type PageName = keyof typeof PAGE_ROUTES;

/** The page of one Coffee Card. */
export const cardPath = (cardId: string) => `/card/${cardId}`;

/**
 * The page a browser shows before launch, when the app is not installed. With
 * a card id, the page also links back to that Coffee Card.
 */
export const comingSoonPath = (cardId?: string) =>
  cardId ? `/coming-soon/${cardId}` : '/coming-soon';

/** The legal pages, in the order the footer and the phone menu list them. */
export const LEGAL_PAGES = [
  'terms',
  'privacy',
  'websitePrivacy',
] as const satisfies readonly PageName[];
