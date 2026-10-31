/** Prompt templates with [placeholders], as the prompt library's figures (TemplateFill, TemplateLibrary) draw them. */

/** A run of plain text, or a [placeholder] with `slot`: its position among the template's placeholders. */
export interface TemplatePart {
  text: string;
  slot?: number;
}

/** "grado [grado] ([edad] años)" → text, slot 0, text, slot 1, text. */
export function splitTemplate(template: string): TemplatePart[] {
  let next = 0;
  return template
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map((text) => (/^\[.+\]$/.test(text) ? { text, slot: next++ } : { text }));
}
