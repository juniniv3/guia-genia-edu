import { describe, expect, it } from 'vitest';
import { joinBase, stripBase, withBase } from './url';

describe('joinBase', () => {
  it('joins a base without a trailing slash', () => {
    expect(joinBase('/guia-genia-edu', '/guia/paso/')).toBe('/guia-genia-edu/guia/paso/');
  });

  it('joins a base with a trailing slash', () => {
    expect(joinBase('/guia-genia-edu/', '/guia/paso/')).toBe('/guia-genia-edu/guia/paso/');
  });

  it('adds the leading slash to relative paths', () => {
    expect(joinBase('/guia-genia-edu', 'favicon.svg')).toBe('/guia-genia-edu/favicon.svg');
  });

  it('keeps the root path pointing at the base', () => {
    expect(joinBase('/guia-genia-edu', '/')).toBe('/guia-genia-edu/');
  });

  it('works with a root base', () => {
    expect(joinBase('/', '/glosario/')).toBe('/glosario/');
  });
});

describe('withBase', () => {
  it('prefixes paths with the configured base', () => {
    expect(withBase('/guia/paso/')).toBe(joinBase(import.meta.env.BASE_URL, '/guia/paso/'));
  });
});

describe('stripBase', () => {
  it('removes the base, with or without a trailing slash', () => {
    expect(stripBase('/guia-genia-edu', '/guia-genia-edu/guia/paso/')).toBe('/guia/paso/');
    expect(stripBase('/guia-genia-edu/', '/guia-genia-edu/en/')).toBe('/en/');
  });

  it('maps the base itself to the root path', () => {
    expect(stripBase('/guia-genia-edu', '/guia-genia-edu')).toBe('/');
    expect(stripBase('/guia-genia-edu', '/guia-genia-edu/')).toBe('/');
  });

  it('leaves paths outside the base alone', () => {
    expect(stripBase('/guia-genia-edu', '/guia-genia-educacion/')).toBe('/guia-genia-educacion/');
    expect(stripBase('/', '/glosario/')).toBe('/glosario/');
  });
});
