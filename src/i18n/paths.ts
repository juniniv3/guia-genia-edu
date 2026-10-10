import { stripBase, withBase } from '../lib/url';
import { DEFAULT_LOCALE, isLocale, type Locale } from './locales';

/** Adds the locale segment to a site path (`/guia/x/` → `/en/guia/x/`); the default locale has none. */
export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return locale === DEFAULT_LOCALE ? normalized : `/${locale}${normalized}`;
}

/** Removes a leading locale segment, leaving the path that is the same in every language. */
export function delocalizePath(path: string): string {
  const [, first, ...rest] = path.split('/');
  if (first === DEFAULT_LOCALE || !isLocale(first)) return path;
  return rest.length === 0 ? '/' : `/${rest.join('/')}`;
}

/** Base-prefixed URL of a site path in `locale`. */
export function localeHref(path: string, locale: Locale): string {
  return withBase(localizePath(path, locale));
}

/** URL of the page at `pathname` (as in `Astro.url.pathname`, base included) in another language. */
export function translatePathname(pathname: string, locale: Locale, base: string = import.meta.env.BASE_URL): string {
  return localeHref(delocalizePath(stripBase(base, pathname)), locale);
}

/** `[...locale]` route param: undefined for the default locale so its pages stay unprefixed. */
export function localeParam(locale: Locale): string | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale;
}
