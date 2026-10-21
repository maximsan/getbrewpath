/** The site's standalone pages. Card pages are listed by the course. */
export const PAGE_ROUTES = {
  home: '/',
  terms: '/terms',
  privacy: '/privacy',
  support: '/support',
} as const;

export type PageName = keyof typeof PAGE_ROUTES;
