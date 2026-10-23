/** The home sections the header links to, in order. Each id is a section id on the home page. */
export const NAV_SECTIONS = [
  { id: 'why', label: 'course' },
  { id: 'how', label: 'how' },
  { id: 'demo', label: 'demo' },
  { id: 'pricing', label: 'pricing' },
  { id: 'faq', label: 'faq' },
] as const;
export type NavSectionId = (typeof NAV_SECTIONS)[number]['id'];

/** A link to a home section. A string, because the router drops the `#section` part of a link given as an object. */
export const sectionHref = (id: string) => `/#${id}`;
