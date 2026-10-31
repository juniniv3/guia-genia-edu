/**
 * Plays an animated figure's CSS animations when it scrolls into view. The figure's own CSS does the animating:
 * with no class (no JavaScript, reduced motion, print) it shows its finished state, `is-armed` applies the animations
 * paused at their first frame, `is-playing` runs them and `is-paused` holds them.
 *
 * The figure's `[data-replay]` button (AnimationButton.astro) replays it. With `pausable`, the button pauses and resumes
 * it while it plays, and turns into a replay button when the animation of its `[data-clock]` element, which lasts the
 * whole timeline, ends. With `loop`, the figure starts again each time the clock ends (after `onLoop`, which can change
 * what the next loop shows), so the button only pauses and resumes. The button's labels come from its `data-label-*`
 * attributes.
 */

export interface PlayOnViewOptions {
  /** How much of the figure must be visible before it plays, from 0 to 1. */
  threshold?: number;
  /** The button also pauses and resumes: required when the animation lasts more than 5 seconds. */
  pausable?: boolean;
  /** Start again whenever the clock ends; while the figure is out of view, hold it. */
  loop?: boolean;
  /** Clicking or tapping the figure itself also pauses and resumes it (with `pausable`). */
  pauseOnClick?: boolean;
  /** With `loop`: runs when a loop ends, just before the next one starts. */
  onLoop?: (figure: HTMLElement) => void;
}

type ButtonState = 'pause' | 'resume' | 'replay';

export function playOnView(
  selector: string,
  { threshold = 0.5, pausable = false, loop = false, pauseOnClick = false, onLoop }: PlayOnViewOptions = {},
): void {
  if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const onView = new Map<Element, (visible: boolean) => void>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) onView.get(entry.target)?.(entry.isIntersecting);
    },
    { threshold },
  );

  for (const figure of document.querySelectorAll<HTMLElement>(selector)) {
    // Paused by the reader (the button), or held because a looping figure is out of view.
    let paused = false;
    let away = false;
    const hold = () => figure.classList.toggle('is-paused', paused || away);

    figure.classList.add('is-armed');
    onView.set(figure, (visible) => {
      if (visible) figure.classList.add('is-playing');
      if (loop) {
        away = !visible;
        hold();
      } else if (visible) {
        observer.unobserve(figure);
      }
    });
    observer.observe(figure);

    const clock = figure.querySelector('[data-clock]');
    if (loop) {
      clock?.addEventListener('animationend', () => {
        onLoop?.(figure);
        restart(figure);
        hold();
      });
    }

    const button = figure.querySelector<HTMLButtonElement>('[data-replay]');
    if (!button) continue;
    button.hidden = false;

    const show = (state: ButtonState) => {
      const labels = {
        pause: button.dataset.labelPause,
        resume: button.dataset.labelResume,
        replay: button.dataset.labelReplay,
      };
      const label = button.querySelector('[data-label]');
      button.dataset.state = state;
      if (label && labels[state]) label.textContent = labels[state];
    };

    // Without pausing, the button only ever replays.
    let ended = !pausable;
    if (pausable && !loop) {
      clock?.addEventListener('animationend', () => {
        ended = true;
        show('replay');
      });
    }

    button.addEventListener('click', () => {
      if (ended) {
        restart(figure);
        ended = !pausable;
        paused = false;
        if (pausable) show('pause');
        return;
      }
      paused = !paused;
      hold();
      show(paused ? 'resume' : 'pause');
    });

    if (pausable && pauseOnClick) {
      figure.addEventListener('click', (event) => {
        if (event.target instanceof Node && button.contains(event.target)) return;
        button.click();
      });
    }
  }
}

/** Runs a figure's animations again from the beginning, even if it was never in view. */
function restart(figure: HTMLElement): void {
  figure.classList.remove('is-armed', 'is-playing', 'is-paused');
  figure.getBoundingClientRect(); // forces a reflow, so the animations start again from the beginning
  figure.classList.add('is-armed', 'is-playing');
}
