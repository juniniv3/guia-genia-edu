import { localeHref } from '../i18n/paths';
import { DEFAULT_LOCALE, isLocale, type Locale } from '../i18n/locales';

export type ModuleSection = 'ruta' | 'recursos';

/** Minimal shape of a `modulos` collection entry, so these helpers stay testable without Astro. */
export interface ModuleLike {
  id: string;
  data: {
    order: number;
    section: ModuleSection;
  };
}

/** A module in one language: `id` is the locale-independent slug, `entry` the file to render. */
export interface LocalizedModule<T extends ModuleLike> extends ModuleLike {
  data: T['data'];
  entry: T;
  /** Language `entry` is written in. Differs from the requested locale when the module isn't translated yet. */
  lang: Locale;
}

export interface Adjacent<T> {
  prev: T | undefined;
  next: T | undefined;
}

/** Splits a collection id (`es/glosario`, from `src/content/modulos/es/glosario.mdx`) into locale and slug. */
export function parseEntryId(id: string): { locale: Locale; slug: string } {
  const [locale, ...rest] = id.split('/');
  if (!isLocale(locale) || rest.length === 0) {
    throw new Error(`Module "${id}" must live in a locale folder, e.g. src/content/modulos/${DEFAULT_LOCALE}/${id}.mdx`);
  }
  return { locale, slug: rest.join('/') };
}

/**
 * The guide in `locale`: one module per default-locale (Spanish) file, using its translation when there is one
 * and the original otherwise. `order` and `section` always come from the original, so translations can't
 * reorder or regroup the guide.
 */
export function localizeModules<T extends ModuleLike>(entries: readonly T[], locale: Locale): LocalizedModule<T>[] {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  return entries.flatMap((original) => {
    const { locale: originalLocale, slug } = parseEntryId(original.id);
    if (originalLocale !== DEFAULT_LOCALE) return [];
    const entry = byId.get(`${locale}/${slug}`) ?? original;
    const { order, section } = original.data;
    return [{ id: slug, data: { ...entry.data, order, section }, entry, lang: parseEntryId(entry.id).locale }];
  });
}

export function sortModules<T extends ModuleLike>(modules: readonly T[]): T[] {
  return [...modules].sort((a, b) => a.data.order - b.data.order);
}

/** Numbered steps of the guide, in reading order. */
export function getRouteModules<T extends ModuleLike>(modules: readonly T[]): T[] {
  return sortModules(modules.filter((m) => m.data.section === 'ruta'));
}

/** Supporting pages (glossary, references, about), shown apart from the numbered steps. */
export function getResourceModules<T extends ModuleLike>(modules: readonly T[]): T[] {
  return sortModules(modules.filter((m) => m.data.section === 'recursos'));
}

/** Previous and next step around `id`; both undefined when `id` is not a route step. */
export function getAdjacent<T extends ModuleLike>(modules: readonly T[], id: string): Adjacent<T> {
  const route = getRouteModules(modules);
  const index = route.findIndex((m) => m.id === id);
  if (index === -1) return { prev: undefined, next: undefined };
  return { prev: route[index - 1], next: route[index + 1] };
}

/** 1-based step number of `id` in the route, or undefined for resource pages. */
export function getStepNumber<T extends ModuleLike>(modules: readonly T[], id: string): number | undefined {
  const index = getRouteModules(modules).findIndex((m) => m.id === id);
  return index === -1 ? undefined : index + 1;
}

/** URL of the module with slug `id` in `locale`. */
export function moduleHref(id: string, locale: Locale): string {
  return localeHref(`/guia/${id}/`, locale);
}
