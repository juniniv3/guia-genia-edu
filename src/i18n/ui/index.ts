import type { Locale } from '../locales';
import { en } from './en';
import { es, type Dictionary } from './es';

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { es, en };

/** UI strings for `locale`. In `.astro` files: `const t = getTranslations(toLocale(Astro.currentLocale))`. */
export function getTranslations(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Splits `text` around `{name}` placeholders, so the `Trans` component can put markup in their place. */
export function splitPlaceholders(text: string): ({ text: string } | { placeholder: string })[] {
  return text
    .split(/(\{\w+\})/)
    .filter((part) => part !== '')
    .map((part) => {
      const name = /^\{(\w+)\}$/.exec(part)?.[1];
      return name ? { placeholder: name } : { text: part };
    });
}
