import { fireEvent, screen } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { promptText, setupCopyButtons } from './copy';

/** A prompt card as PromptExample.astro renders it with `copy`; returns its body. */
function renderCard(body: string) {
  document.body.innerHTML = `
    <figure>
      <figcaption>Plantilla</figcaption>
      <button type="button" data-copy data-label-copied="¡Copiado!" hidden><span data-label>Copiar</span></button>
      <span data-copy-status></span>
      <div data-prompt-body>${body}</div>
    </figure>`;
  const element = document.querySelector('[data-prompt-body]');
  if (!element) throw new Error('card not rendered');
  return element;
}

function div(html: string) {
  const element = document.createElement('div');
  element.innerHTML = html;
  return element;
}

describe('promptText', () => {
  it('keeps the line breaks of each paragraph and the markers of a list', () => {
    const body = div(
      '<p>Actúa como docente de [área].\nMis estudiantes son de grado [grado].\nCrea tres niveles:</p><ul>\n' +
        '<li>Nivel 1: con apoyo.</li>\n<li>Nivel 2: esperado.</li>\n</ul><p>Usa ejemplos de Colombia.</p>',
    );
    expect(promptText(body)).toBe(
      'Actúa como docente de [área].\nMis estudiantes son de grado [grado].\nCrea tres niveles:\n' +
        '- Nivel 1: con apoyo.\n- Nivel 2: esperado.\n\nUsa ejemplos de Colombia.',
    );
  });

  it('numbers the items of an ordered list', () => {
    expect(promptText(div('<p>Crea:</p><ol><li>Una lectura.</li><li>Un guion.</li></ol>'))).toBe(
      'Crea:\n1. Una lectura.\n2. Un guion.',
    );
  });
});

describe('setupCopyButtons', () => {
  const writeText = vi.fn<(text: string) => Promise<void>>();

  beforeEach(() => {
    vi.useFakeTimers();
    writeText.mockReset().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('copies the prompt and says so for two seconds', async () => {
    renderCard('<p>Explica [tema] para grado [grado].</p>');
    setupCopyButtons();

    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }));
    await vi.advanceTimersByTimeAsync(0);
    expect(writeText).toHaveBeenCalledWith('Explica [tema] para grado [grado].');
    expect(screen.getByRole('button', { name: '¡Copiado!' })).toHaveAttribute('data-copied');
    expect(document.querySelector('[data-copy-status]')).toHaveTextContent('¡Copiado!');

    await vi.advanceTimersByTimeAsync(2000);
    expect(screen.getByRole('button', { name: 'Copiar' })).not.toHaveAttribute('data-copied');
  });

  it('selects the prompt when the browser blocks copying', async () => {
    writeText.mockRejectedValue(new Error('not allowed'));
    renderCard('<p>Explica [tema].</p>');
    setupCopyButtons();

    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }));
    await vi.advanceTimersByTimeAsync(0);
    expect(document.getSelection()?.toString()).toBe('Explica [tema].');
    expect(screen.getByRole('button', { name: 'Copiar' })).toBeInTheDocument();
  });

  it('leaves the button hidden when the browser has no clipboard', () => {
    vi.stubGlobal('navigator', {});
    renderCard('<p>Explica [tema].</p>');
    setupCopyButtons();

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
