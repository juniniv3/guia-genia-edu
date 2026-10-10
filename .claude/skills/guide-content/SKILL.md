---
name: guide-content
description: Edit, add or reorganize the teacher guide's content (the Spanish MDX modules in src/content/modulos) - steps, glossary, references, prompt templates, callouts and examples. Use for any change to the guide's text or structure, including applying feedback from teacher interviews.
---

# Editing the guide's content

All guide text lives in `src/content/modulos/*.mdx`, one file per page. Pages, sidebar, home cards, "Paso X de N" labels and prev/next links are generated from these files, so content work almost never touches code.

## 1. Where content lives

| File | Page | URL |
| --- | --- | --- |
| `que-es-la-ia-generativa.mdx` | Paso 1 · What generative AI is | `/guia/que-es-la-ia-generativa/` |
| `material-adaptativo.mdx` | Paso 2 · Adaptive material (Tomlinson, DUA) | `/guia/material-adaptativo/` |
| `elegir-herramienta.mdx` | Paso 3 · Choosing a tool (dated tools table) | `/guia/elegir-herramienta/` |
| `escribir-prompts.mdx` | Paso 4 · The 6 prompt ingredients, CLEAR, patterns | `/guia/escribir-prompts/` |
| `crear-paso-a-paso.mdx` | Paso 5 · Creation cycle + worked example | `/guia/crear-paso-a-paso/` |
| `revisar-calidad.mdx` | Paso 6 · Quality checklist | `/guia/revisar-calidad/` |
| `uso-etico.mdx` | Paso 7 · Ethics, privacy, Colombian law | `/guia/uso-etico/` |
| `biblioteca-de-prompts.mdx` | Paso 8 · Prompt template library | `/guia/biblioteca-de-prompts/` |
| `glosario.mdx` | Recursos · Glossary | `/guia/glosario/` |
| `referencias.mdx` | Recursos · Full APA references | `/guia/referencias/` |
| `acerca.mdx` | Recursos · About, thesis credit, version note | `/guia/acerca/` |

The home page text (hero, "¿Para quién es?", "Al terminar podrás…") is in `src/pages/index.astro`. The `outcomes` list there mirrors the steps, so update it when steps change.

## 2. Frontmatter

The schema is in `src/content.config.ts`; the build fails if a field is missing or has the wrong type.

```yaml
---
title: '¿Qué es la IA generativa?'       # page H1; quote it if it contains ":"
navTitle: Qué es la IA generativa       # optional short label for sidebar, cards, prev/next
description: Entiende en palabras sencillas qué es…   # lead paragraph + meta description
summary: Qué es, cómo funciona y cuáles son sus límites.   # one line on the home card
order: 1                                # integer sort key; only the relative order matters
section: ruta                           # ruta = numbered step, recursos = glossary/references/about
readingMinutes: 6                       # about words / 200, rounded
sources:                                # short citations shown under "Fuentes de este módulo"
  - UNESCO (2024). Guía para el uso de IA generativa en educación e investigación
---
```

- `order` must be an integer. Steps use 1–99; resources use 100+ (`glosario` 100, `referencias` 101, `acerca` 102).
- Every entry in `sources` must have a full APA entry in `referencias.mdx` (see §8).

## 3. Adding, removing or reordering a step

1. Create `src/content/modulos/<slug>.mdx`, using a kebab-case Spanish slug, since it becomes the URL. Start from [module-template.mdx](module-template.mdx).
2. Set `order`, between the neighbours or renumbering them.
3. Fix the text cross-references. Modules point to each other by number ("ver Paso 6", "lo verás en el Paso 4"). Run `grep -rn "Paso [0-9]" src/content src/pages` and update every reference whose number changed.
4. `src/components/SiteHeader.astro` links **"La guía"** to the *first* step and **"Prompts"** to the *last* step. If the prompt library is no longer the last step, change that link to `moduleHref('biblioteca-de-prompts')`.
5. Update the `outcomes` list in `src/pages/index.astro` if what teachers will learn changed.

The step count ("La ruta en 8 pasos") and "Paso X de N" are computed automatically.

## 4. Components available in MDX

Import what you use at the top of the file, below the frontmatter:

```mdx
import BeforeAfter from '../../components/BeforeAfter.astro';
import Callout from '../../components/Callout.astro';
import PromptExample from '../../components/PromptExample.astro';
import Resumen from '../../components/Resumen.astro';
```

**Callout**: a highlighted note. `type` is `idea` (default, "Idea clave"), `consejo` ("Consejo"), `cuidado` ("Cuidado") or `ejemplo` ("Ejemplo"). The optional `title` overrides the default heading.

```mdx
<Callout type="cuidado" title="Regla de oro">
**Si no lo puedes verificar, no lo uses.**
</Callout>
```

**PromptExample**: a prompt shown as a card. `variant` is `neutral` (default, "Prompt"), `weak` ("Prompt débil", ✗) or `strong` ("Prompt mejorado", ✓). The optional `label` overrides the heading, e.g. "Plantilla" or "Mensajes de ajuste". Line breaks inside are preserved.

**BeforeAfter**: wraps exactly two PromptExamples side by side (weak first); they stack on mobile.

```mdx
<BeforeAfter>
<PromptExample variant="weak">
Hazme un taller de fracciones.
</PromptExample>
<PromptExample variant="strong">
Actúa como docente de matemáticas de primaria…
</PromptExample>
</BeforeAfter>
```

**Resumen**: the "En resumen" box that closes every step. The optional `title` changes the heading.

```mdx
<Resumen>
- Primera idea clave.
- Segunda idea clave.
</Resumen>
```

Plain Markdown that is already styled:
- GFM tables, which scroll sideways on phones.
- `- [ ]` task lists, which render as read-only checkboxes for printable checklists (see `revisar-calidad.mdx`). Use them only for checklists.
- `> blockquote`, for example a note to paste at the bottom of a worksheet.

## 5. Module structure

- At least two `##` sections. They feed the "En esta página" box, so make them short and scannable, questions allowed. Use `###` for subsections.
- At least one **concrete classroom example**: grade, subject, topic and what the teacher does.
- At most one Callout per section; too many and they lose their effect.
- Every step (`section: ruta`) ends with a `<Resumen>` of 3–4 bullets. Resource pages don't need one.
- Keep each step at a 5–10 minute read. If it grows beyond that, split it into two steps.

## 6. Writing style (Spanish, for teachers)

- Address the reader as **"tú"**. Use short sentences and one idea per paragraph.
- **Plain language first, theory second.** Explain the idea in classroom terms, then name the author: "el andamiaje justo (Vygotsky)". Keep inline citations sparse, (Autor, año), and put the full list in `sources`.
- Define a technical term the first time it appears, and add it to `glosario.mdx` (alphabetical, `**Término.** Definición.`).
- **Colombian context**: grados, pesos, colegio público or privado, MEN Estándares and DBA, local places and food (arepas, la tienda del barrio, Bucaramanga, Santander).
- Spread examples across levels (preescolar to secundaria) and subjects (matemáticas, lenguaje, ciencias, sociales, educación infantil, filosofía).
- Use inclusive language and diverse names and situations.
- **Privacy rule in every example:** prompts describe the group or a need, never a real student. Write "un estudiante de grado 6 que necesita instrucciones cortas", not a name or diagnosis.
- Use sentence-case headings and no emoji. "Prompt" stays in English, as the guide defines it in Paso 4.

## 7. Prompt templates (Paso 8)

New templates in `biblioteca-de-prompts.mdx` follow this exact block, continuing the numbering:

```mdx
## 12. Título de la plantilla

**Qué adapta:** contenido · **Según:** preparación · **Ideal para:** cualquier área.

<PromptExample label="Plantilla">
Actúa como docente de [área] con experiencia en [enfoque].
Mis estudiantes son de grado [grado] ([edad] años) y [característica del grupo].
Objetivo de aprendizaje: [objetivo].
Crea [material] sobre [tema]:
- [Requisito 1]
- [Requisito 2]

Formato: [formato]. Usa ejemplos del contexto colombiano.
</PromptExample>

**Ejemplo de uso:** área, grado N, "tema concreto".
```

- "Qué adapta" uses the Tomlinson dimensions (contenido, proceso, producto); "Según" uses preparación, intereses or perfil (omit it if it doesn't apply).
- Cover the 6 ingredients from Paso 4 where they make sense: rol, contexto de los estudiantes, objetivo, tarea, formato, criterios.
- Placeholders go in `[corchetes]`.

## 8. Sources and references

- New source: add the short form to the module's `sources`, and the full **APA 7** entry to `referencias.mdx` in the right section (Fuentes académicas, Organismos internacionales, Normativa y política pública de Colombia, Herramientas), in alphabetical order.
- **Time-sensitive facts** (tool features, prices, age limits, laws, policies): verify them on the web before writing, and record the date. The Paso 3 tool table says "revisados en octubre de 2026", and the "Herramientas" entry in `referencias.mdx` has the same date; update both together.
- Don't invent citations. If a claim can't be sourced, rephrase it as practical advice or drop it.

## 9. MDX pitfalls

- `{`, `}` and `<` in prose are parsed as code and break the build. Rephrase, or escape with a backslash (`\{`).
- `[texto](` becomes a link. With placeholders, keep a space before parentheses: `[grado] ([edad] años)`.
- Inside a component, a line directly after a list item is merged into that item. Leave a blank line after every list:
  ```mdx
  - Nivel 3: un problema abierto.

  Preséntalo en una tabla…
  ```
- Put component tags on their own lines, with the content on the lines between them and no indentation.
- Quote YAML values that contain `:` (e.g. `title: 'Cómo pedirle a la IA: escribir buenos prompts'`).

## 10. Changes that come from interview feedback

The guide is revised in action-research cycles. The thesis interview covers clarity and structure, pedagogical relevance, skill development, applicability, ethics and improvement suggestions. When applying feedback:

- Name the category each change addresses in your summary, so the author can report it in the thesis.
- Prefer clarifying what exists (examples, shorter sentences, a missing step) over adding new sections.
- When the author releases a revised version, update the "Versión base" callout in `acerca.mdx` (e.g. "Versión 2 — ajustada con los aportes de …").

## 11. Verify before finishing

```sh
npm run lint && npm run typecheck && npm test && npm run build
grep -rn 'href="/' dist | grep -v 'href="/guia-genia-edu' || echo "links OK"
```

Then open the changed page in the dev server (`astro dev --background`, http://localhost:4321/guia-genia-edu/guia/<slug>/) and check the sidebar, "En esta página", the components and the Resumen. If pages show no content, see the stale-cache gotcha in CLAUDE.md.
