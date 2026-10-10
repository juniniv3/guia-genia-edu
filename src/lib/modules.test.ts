import { describe, expect, it } from 'vitest';
import {
  getAdjacent,
  getResourceModules,
  getRouteModules,
  getStepNumber,
  localizeModules,
  moduleHref,
  parseEntryId,
  sortModules,
  type ModuleLike,
} from './modules';

const modules: ModuleLike[] = [
  { id: 'glosario', data: { order: 100, section: 'recursos' } },
  { id: 'prompts', data: { order: 2, section: 'ruta' } },
  { id: 'etica', data: { order: 3, section: 'ruta' } },
  { id: 'acerca', data: { order: 102, section: 'recursos' } },
  { id: 'intro', data: { order: 1, section: 'ruta' } },
];

const ids = (list: ModuleLike[]) => list.map((m) => m.id);

describe('sortModules', () => {
  it('orders by the order field without mutating the input', () => {
    const copy = [...modules];
    expect(ids(sortModules(modules))).toEqual(['intro', 'prompts', 'etica', 'glosario', 'acerca']);
    expect(modules).toEqual(copy);
  });
});

describe('getRouteModules / getResourceModules', () => {
  it('splits steps from resources, each in order', () => {
    expect(ids(getRouteModules(modules))).toEqual(['intro', 'prompts', 'etica']);
    expect(ids(getResourceModules(modules))).toEqual(['glosario', 'acerca']);
  });
});

describe('getAdjacent', () => {
  it('returns the surrounding steps', () => {
    const { prev, next } = getAdjacent(modules, 'prompts');
    expect(prev?.id).toBe('intro');
    expect(next?.id).toBe('etica');
  });

  it('has no previous step at the start and no next step at the end', () => {
    expect(getAdjacent(modules, 'intro').prev).toBeUndefined();
    expect(getAdjacent(modules, 'etica').next).toBeUndefined();
  });

  it('does not link resource pages into the route', () => {
    expect(getAdjacent(modules, 'glosario')).toEqual({ prev: undefined, next: undefined });
  });
});

describe('getStepNumber', () => {
  it('numbers route steps from 1', () => {
    expect(getStepNumber(modules, 'intro')).toBe(1);
    expect(getStepNumber(modules, 'etica')).toBe(3);
  });

  it('returns undefined for resources and unknown ids', () => {
    expect(getStepNumber(modules, 'acerca')).toBeUndefined();
    expect(getStepNumber(modules, 'nope')).toBeUndefined();
  });
});

describe('moduleHref', () => {
  it('builds a base-prefixed URL with a trailing slash', () => {
    expect(moduleHref('intro', 'es')).toMatch(/\/guia\/intro\/$/);
    expect(moduleHref('intro', 'es').startsWith(import.meta.env.BASE_URL.replace(/\/$/, ''))).toBe(true);
  });

  it('keeps Spanish unprefixed and puts other locales under their own segment', () => {
    expect(moduleHref('intro', 'es')).not.toContain('/es/');
    expect(moduleHref('intro', 'en')).toMatch(/\/en\/guia\/intro\/$/);
  });
});

describe('parseEntryId', () => {
  it('splits the locale folder from the slug', () => {
    expect(parseEntryId('en/glosario')).toEqual({ locale: 'en', slug: 'glosario' });
  });

  it('rejects modules outside a locale folder', () => {
    expect(() => parseEntryId('glosario')).toThrow(/locale folder/);
    expect(() => parseEntryId('fr/glosario')).toThrow(/locale folder/);
  });
});

describe('localizeModules', () => {
  interface Entry extends ModuleLike {
    data: ModuleLike['data'] & { title: string };
  }

  const entries: Entry[] = [
    { id: 'es/intro', data: { order: 1, section: 'ruta', title: 'Introducción' } },
    { id: 'es/etica', data: { order: 2, section: 'ruta', title: 'Ética' } },
    { id: 'en/intro', data: { order: 9, section: 'recursos', title: 'Introduction' } },
    { id: 'en/huerfano', data: { order: 3, section: 'ruta', title: 'Orphan' } },
  ];

  it('uses translations by slug and falls back to the Spanish original', () => {
    const en = localizeModules(entries, 'en');
    expect(en.map((m) => [m.id, m.data.title, m.lang])).toEqual([
      ['intro', 'Introduction', 'en'],
      ['etica', 'Ética', 'es'],
    ]);
    expect(en[0]?.entry).toBe(entries[2]);
  });

  it('takes order and section from the original', () => {
    expect(localizeModules(entries, 'en')[0]?.data).toMatchObject({ order: 1, section: 'ruta' });
  });

  it('ignores translations without a Spanish original', () => {
    expect(localizeModules(entries, 'en').map((m) => m.id)).not.toContain('huerfano');
  });

  it('returns the originals for the default locale', () => {
    expect(localizeModules(entries, 'es').map((m) => [m.id, m.lang])).toEqual([
      ['intro', 'es'],
      ['etica', 'es'],
    ]);
  });
});
