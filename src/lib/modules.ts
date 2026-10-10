import { withBase } from './url';

export type ModuleSection = 'ruta' | 'recursos';

/** Minimal shape of a `modulos` collection entry, so these helpers stay testable without Astro. */
export interface ModuleLike {
  id: string;
  data: {
    order: number;
    section: ModuleSection;
  };
}

export interface Adjacent<T> {
  prev: T | undefined;
  next: T | undefined;
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

export function moduleHref(id: string): string {
  return withBase(`/guia/${id}/`);
}
