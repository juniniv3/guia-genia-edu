import { describe, expect, it } from 'vitest';
import {
  getAdjacent,
  getResourceModules,
  getRouteModules,
  getStepNumber,
  moduleHref,
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
    expect(moduleHref('intro')).toMatch(/\/guia\/intro\/$/);
    expect(moduleHref('intro').startsWith(import.meta.env.BASE_URL.replace(/\/$/, ''))).toBe(true);
  });
});
