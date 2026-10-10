/** Joins a base path and a site path without doubling or dropping the slash between them. */
export function joinBase(base: string, path: string): string {
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${normalizedPath}`;
}

/** Prefixes an internal path with the configured `base` (the site is served under a GitHub Pages subpath). */
export function withBase(path: string): string {
  return joinBase(import.meta.env.BASE_URL, path);
}
