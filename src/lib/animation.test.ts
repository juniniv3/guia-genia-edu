import { fireEvent, screen } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { playOnView } from './animation';

/** Stands in for IntersectionObserver: `show` / `hide` tell the callback that an element came into or left the view. */
class FakeObserver {
  static last: FakeObserver | undefined;
  readonly observed = new Set<Element>();
  readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeObserver.last = this;
  }

  observe(element: Element) {
    this.observed.add(element);
  }

  unobserve(element: Element) {
    this.observed.delete(element);
  }

  disconnect() {
    this.observed.clear();
  }

  show(element: Element) {
    this.report(element, true);
  }

  hide(element: Element) {
    this.report(element, false);
  }

  private report(element: Element, isIntersecting: boolean) {
    const entry = { isIntersecting, target: element } as unknown as IntersectionObserverEntry;
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}

let reduceMotion = false;

/** A figure as AnimationButton.astro renders it; returns the figure and its clock. */
function renderFigure(pausable: boolean) {
  const label = pausable ? 'Pause' : 'Play again';
  document.body.innerHTML = `
    <div data-figure>
      <span data-clock></span>
      <button type="button" data-replay hidden data-label-pause="Pause" data-label-resume="Resume"
        data-label-replay="Play again"><span data-label>${label}</span></button>
    </div>`;
  const figure = document.querySelector<HTMLElement>('[data-figure]');
  const clock = document.querySelector<HTMLElement>('[data-clock]');
  if (!figure || !clock) throw new Error('figure not rendered');
  return { figure, clock };
}

function observer() {
  if (!FakeObserver.last) throw new Error('no IntersectionObserver was created');
  return FakeObserver.last;
}

beforeEach(() => {
  reduceMotion = false;
  FakeObserver.last = undefined;
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduceMotion && query.includes('reduce') }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('playOnView', () => {
  it('arms the figure and plays it once it comes into view', () => {
    const { figure } = renderFigure(false);
    playOnView('[data-figure]');

    expect(figure).toHaveClass('is-armed');
    expect(figure).not.toHaveClass('is-playing');

    observer().show(figure);
    expect(figure).toHaveClass('is-armed', 'is-playing');
    expect(observer().observed.has(figure)).toBe(false);
  });

  it('leaves the finished state alone when the reader prefers reduced motion', () => {
    reduceMotion = true;
    const { figure } = renderFigure(true);
    playOnView('[data-figure]', { pausable: true });

    expect(figure).not.toHaveClass('is-armed');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('replays from the beginning, even before the figure was in view', () => {
    const { figure } = renderFigure(false);
    playOnView('[data-figure]');

    fireEvent.click(screen.getByRole('button', { name: 'Play again' }));
    expect(figure).toHaveClass('is-armed', 'is-playing');
  });

  it('pauses and resumes while a pausable figure plays', () => {
    const { figure } = renderFigure(true);
    playOnView('[data-figure]', { pausable: true });
    observer().show(figure);

    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(figure).toHaveClass('is-paused');

    fireEvent.click(screen.getByRole('button', { name: 'Resume' }));
    expect(figure).not.toHaveClass('is-paused');
    expect(screen.getByRole('button', { name: 'Pause' })).toHaveAttribute('data-state', 'pause');
  });

  it('turns the button into a replay button when the timeline ends', () => {
    const { figure, clock } = renderFigure(true);
    playOnView('[data-figure]', { pausable: true });
    observer().show(figure);

    fireEvent.animationEnd(clock);
    fireEvent.click(screen.getByRole('button', { name: 'Play again' }));

    expect(figure).toHaveClass('is-armed', 'is-playing');
    expect(figure).not.toHaveClass('is-paused');
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('starts a looping figure again each time the timeline ends', () => {
    const { figure, clock } = renderFigure(true);
    playOnView('[data-figure]', { pausable: true, loop: true });
    observer().show(figure);
    const reflow = vi.spyOn(figure, 'getBoundingClientRect');

    fireEvent.animationEnd(clock);
    expect(reflow).toHaveBeenCalledOnce();
    expect(figure).toHaveClass('is-armed', 'is-playing');
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('holds a looping figure while it is out of view, unless the reader paused it', () => {
    const { figure } = renderFigure(true);
    playOnView('[data-figure]', { pausable: true, loop: true });
    observer().show(figure);

    observer().hide(figure);
    expect(figure).toHaveClass('is-paused');
    observer().show(figure);
    expect(figure).not.toHaveClass('is-paused');

    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    observer().hide(figure);
    observer().show(figure);
    expect(figure).toHaveClass('is-paused');
  });

  it('pauses and resumes when the figure itself is clicked', () => {
    const { figure } = renderFigure(true);
    playOnView('[data-figure]', { pausable: true, loop: true, pauseOnClick: true });
    observer().show(figure);

    fireEvent.click(figure);
    expect(figure).toHaveClass('is-paused');
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();

    fireEvent.click(figure);
    expect(figure).not.toHaveClass('is-paused');
  });
});
