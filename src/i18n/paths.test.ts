import { describe, expect, it } from 'vitest';
import { withBase } from '../lib/url';
import { delocalizePath, localeParam, localizePath, translatePathname } from './paths';

describe('localizePath', () => {
  it('leaves default-locale (Spanish) paths unprefixed', () => {
    expect(localizePath('/guia/paso/', 'es')).toBe('/guia/paso/');
  });

  it('prefixes other locales', () => {
    expect(localizePath('/guia/paso/', 'en')).toBe('/en/guia/paso/');
    expect(localizePath('/', 'en')).toBe('/en/');
    expect(localizePath('guia/paso/', 'en')).toBe('/en/guia/paso/');
  });
});

describe('delocalizePath', () => {
  it('removes a locale prefix', () => {
    expect(delocalizePath('/en/guia/paso/')).toBe('/guia/paso/');
    expect(delocalizePath('/en/')).toBe('/');
    expect(delocalizePath('/en')).toBe('/');
  });

  it('leaves default-locale and unknown paths alone', () => {
    expect(delocalizePath('/guia/paso/')).toBe('/guia/paso/');
    expect(delocalizePath('/')).toBe('/');
    expect(delocalizePath('/entrada/')).toBe('/entrada/');
  });
});

describe('translatePathname', () => {
  const base = '/guia-genia-edu';

  it('switches a module page between languages', () => {
    expect(translatePathname('/guia-genia-edu/guia/paso/', 'en', base)).toBe(withBase('/en/guia/paso/'));
    expect(translatePathname('/guia-genia-edu/en/guia/paso/', 'es', base)).toBe(withBase('/guia/paso/'));
  });

  it('switches the home page between languages', () => {
    expect(translatePathname('/guia-genia-edu/', 'en', base)).toBe(withBase('/en/'));
    expect(translatePathname('/guia-genia-edu/en/', 'es', base)).toBe(withBase('/'));
  });

  it('keeps the current language when asked for it', () => {
    expect(translatePathname('/guia-genia-edu/en/guia/paso/', 'en', base)).toBe(withBase('/en/guia/paso/'));
  });
});

describe('localeParam', () => {
  it('is undefined for the default locale so its routes have no prefix', () => {
    expect(localeParam('es')).toBeUndefined();
    expect(localeParam('en')).toBe('en');
  });
});
