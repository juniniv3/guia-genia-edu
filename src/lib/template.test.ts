import { describe, expect, it } from 'vitest';
import { splitTemplate } from './template';

describe('splitTemplate', () => {
  it('alternates text and placeholders, numbering the placeholders in order', () => {
    expect(splitTemplate('grado [grado] ([edad] años)')).toEqual([
      { text: 'grado ' },
      { text: '[grado]', slot: 0 },
      { text: ' (' },
      { text: '[edad]', slot: 1 },
      { text: ' años)' },
    ]);
  });

  it('leaves out empty parts around placeholders at the edges or side by side', () => {
    expect(splitTemplate('[área][grado] y [tema]')).toEqual([
      { text: '[área]', slot: 0 },
      { text: '[grado]', slot: 1 },
      { text: ' y ' },
      { text: '[tema]', slot: 2 },
    ]);
  });

  it('keeps a template without placeholders as one text part', () => {
    expect(splitTemplate('Hazme un taller de fracciones.')).toEqual([{ text: 'Hazme un taller de fracciones.' }]);
  });

  it('treats an unclosed bracket as plain text', () => {
    expect(splitTemplate('Usa [máximo 5 palabras.')).toEqual([{ text: 'Usa [máximo 5 palabras.' }]);
  });
});
