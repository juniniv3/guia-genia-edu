/**
 * The "Copiar" button of a prompt card (PromptExample with `copy`): copies the prompt as plain text, ready to paste
 * into an AI tool, and says "¡Copiado!" for two seconds.
 */

/** The prompt in a card's body as plain text: paragraphs keep their line breaks, and lists their "- " or "1. ". */
export function promptText(body: Element): string {
  let text = '';
  for (const block of body.children) {
    const list = block.tagName === 'UL' || block.tagName === 'OL';
    const lines = list
      ? [...block.children].map((item, i) => `${block.tagName === 'OL' ? `${i + 1}.` : '-'} ${tidy(item.textContent)}`)
      : [tidy(block.textContent)];
    // A list follows its paragraph directly, as in the guide's MDX; other blocks are separated by a blank line.
    if (text) text += list ? '\n' : '\n\n';
    text += lines.join('\n');
  }
  return text;
}

/** Trims a block and each of its lines. */
function tidy(text: string | null): string {
  return (text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
}

/**
 * Turns on every `[data-copy]` button. They stay hidden without JavaScript or the Clipboard API, since then they
 * couldn't copy anything. If the browser blocks copying, the prompt gets selected, so it can be copied by hand.
 */
export function setupCopyButtons(): void {
  if (!navigator.clipboard) return;

  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
    const card = button.closest('figure');
    const body = card?.querySelector('[data-prompt-body]');
    const label = button.querySelector('[data-label]');
    const status = card?.querySelector('[data-copy-status]');
    if (!body || !label) continue;

    const idle = label.textContent;
    const copied = button.dataset.labelCopied ?? '';
    let reset: ReturnType<typeof setTimeout> | undefined;
    button.hidden = false;

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(promptText(body));
      } catch {
        getSelection()?.selectAllChildren(body);
        return;
      }
      button.dataset.copied = '';
      label.textContent = copied;
      if (status) status.textContent = copied;
      clearTimeout(reset);
      reset = setTimeout(() => {
        delete button.dataset.copied;
        label.textContent = idle;
        if (status) status.textContent = '';
      }, 2000);
    });
  }
}
