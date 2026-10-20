import { getPathname } from './navigation';
import { type Locale, routing } from './routing';

/** The address of the page at `path` in `locale`, e.g. "/be/terms". */
export const localizedPath = (locale: Locale, path: string) => getPathname({ locale, href: path });

/**
 * The page's address in every language, keyed by language code, as search
 * engines read them. "x-default" names the version for any other language.
 */
export const languageVersions = (path: string): Record<string, string> => ({
  ...Object.fromEntries(routing.locales.map((locale) => [locale, localizedPath(locale, path)])),
  'x-default': localizedPath(routing.defaultLocale, path),
});
