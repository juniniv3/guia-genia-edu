import { describe, expect, it } from 'vitest';
import { LOCALES } from '../locales';
import { getTranslations, splitPlaceholders } from './index';
import { es } from './es';

/** Every key path in a dictionary, with array lengths, so translations can be compared with the original. */
function shape(value: unknown, path = ''): string[] {
  if (Array.isArray(value)) return [`${path}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, v]) => shape(v, path ? `${path}.${key}` : key));
  }
  return [`${path}:${typeof value}`];
}

describe('dictionaries', () => {
  it.each(LOCALES)('%s has the same keys and list lengths as the Spanish original', (locale) => {
    expect(shape(getTranslations(locale))).toEqual(shape(es));
  });

  it.each(LOCALES)('%s keeps the placeholders of every rich-text string', (locale) => {
    const placeholders = (text: string) => splitPlaceholders(text).flatMap((p) => ('placeholder' in p ? [p.placeholder] : []));
    const t = getTranslations(locale);
    expect(placeholders(t.module.seeReferences)).toEqual(placeholders(es.module.seeReferences));
    expect(placeholders(t.prevNext.finished).sort()).toEqual(placeholders(es.prevNext.finished).sort());
  });
});

describe('splitPlaceholders', () => {
  it('splits text around named placeholders', () => {
    expect(splitPlaceholders('See the {glossary} or the {references}.')).toEqual([
      { text: 'See the ' },
      { placeholder: 'glossary' },
      { text: ' or the ' },
      { placeholder: 'references' },
      { text: '.' },
    ]);
  });

  it('returns plain text unchanged', () => {
    expect(splitPlaceholders('No markup here')).toEqual([{ text: 'No markup here' }]);
  });
});
