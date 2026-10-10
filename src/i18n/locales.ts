/**
 * Languages the guide is published in. Spanish is the original; the others are translations of it.
 * `astro.config.mjs` reads this list, so adding a locale here also adds it to Astro's i18n routing.
 */
export const LOCALES = ['es', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/** Served without a URL prefix (`/guia/…`); every other locale lives under `/<locale>/…`. */
export const DEFAULT_LOCALE: Locale = 'es';

interface LocaleInfo {
  /** The language's own name, shown in the language picker. */
  name: string;
  /** Short label for the picker button. */
  short: string;
  /** Open Graph locale (`language_TERRITORY`). */
  ogLocale: string;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  es: { name: 'Español', short: 'ES', ogLocale: 'es_CO' },
  en: { name: 'English', short: 'EN', ogLocale: 'en_US' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Narrows `Astro.currentLocale` (a plain string, undefined outside i18n routes) to a supported locale. */
export function toLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
