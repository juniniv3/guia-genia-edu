---
name: guide-content
description: Edit, add, reorganize or translate the teacher guide's content (the Spanish MDX modules in src/content/modulos/es and their English translations in src/content/modulos/en) - steps, glossary, references, prompt templates, callouts and examples. Use for any change to the guide's text or structure, including applying feedback from teacher interviews.
---

# Editing the guide's content

All guide text lives in `src/content/modulos/es/*.mdx` (Spanish, the original), one file per page, with an English translation of each in `src/content/modulos/en/` under the **same file name**. Pages, sidebar, home cards, "Paso X de N" labels and prev/next links are generated from these files, so content work almost never touches code. Spanish is served at `/guia/<slug>/`, English at `/en/guia/<slug>/`.

## 1. Where content lives

| File (in `es/` and `en/`) | Page | Spanish URL |
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

The home page text (hero, "¿Para quién es?", "Al terminar podrás…") and all site chrome text are in `src/i18n/ui/es.ts` and its translation `src/i18n/ui/en.ts`. The `home.outcomes` list mirrors the steps, so update it in both files when steps change.

## 1b. Keeping the English translation in sync

Every change to a Spanish module should be mirrored in its `en/` file in the same change, unless the author says otherwise:

- Translate into plain, friendly English for teachers ("you"), keeping the same structure: frontmatter, headings, components, tables and list items line up one-to-one with the Spanish file.
- **Keep the Colombian context**: grades (grado 6 → grade 6), pesos, Bucaramanga, Santander, arepas, MEN, DBA. Gloss a local term the first time it appears ("arepas (Colombian corn cakes)", "Basic Learning Rights (DBA)").
- Translate prompts and placeholders (`[grado]` → `[grade]`), so teachers can paste them as they are. "Paso N" becomes "Step N"; DUA is UDL.
- Translate every figure's props and `caption` (§4b): their text lives in the MDX, not in the components.
- In `sources`, use "and" instead of "y" and the English title when the work has one (see `en/referencias.mdx`). In `en/referencias.mdx`, follow APA 7 in English (`&`, "2nd ed.", "Master's thesis") and add an English translation in square brackets after Spanish titles.
- Re-sort the English glossary alphabetically by the English term.
- `order` and `section` in `en/` files are ignored (the Spanish file decides); keep them equal anyway. `readingMinutes` and the rest are read from the translation.
- A Spanish module without an `en/` file still builds: the English site shows the Spanish text with a "not translated yet" notice. Use this only as a temporary state, and say so in your summary.

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

1. Create `src/content/modulos/es/<slug>.mdx`, using a kebab-case Spanish slug, since it becomes the URL in both languages. Start from [module-template.mdx](module-template.mdx). Then add the translation as `src/content/modulos/en/<slug>.mdx` (§1b).
2. Set `order`, between the neighbours or renumbering them.
3. Fix the text cross-references. Modules point to each other by number ("ver Paso 6", "lo verás en el Paso 4"; "see Step 6" in English). Run `grep -rnE "Paso [0-9]|Step [0-9]" src/content src/i18n` and update every reference whose number changed, in both languages.
4. `src/components/SiteHeader.astro` links **"La guía"** to the *first* step and **"Prompts"** to the *last* step. If the prompt library is no longer the last step, change that link to `moduleHref('biblioteca-de-prompts')`.
5. Update `home.outcomes` in `src/i18n/ui/es.ts` and `en.ts` if what teachers will learn changed.

The step count ("La ruta en 8 pasos") and "Paso X de N" are computed automatically.

## 4. Components available in MDX

Import what you use at the top of the file, below the frontmatter:

```mdx
import BeforeAfter from '../../../components/BeforeAfter.astro';
import Callout from '../../../components/Callout.astro';
import PromptExample from '../../../components/PromptExample.astro';
import Resumen from '../../../components/Resumen.astro';
```

**Callout**: a highlighted note. `type` is `idea` (default, "Idea clave"), `consejo` ("Consejo"), `cuidado` ("Cuidado") or `ejemplo` ("Ejemplo"). The `type` values stay in Spanish in every language; the default headings are translated automatically ("Key idea", "Tip", "Watch out", "Example"). The optional `title` overrides the default heading, so translate it in `en/` files.

```mdx
<Callout type="cuidado" title="Regla de oro">
**Si no lo puedes verificar, no lo uses.**
</Callout>
```

**PromptExample**: a prompt shown as a card. `variant` is `neutral` (default, "Prompt"), `weak` ("Prompt débil", ✗) or `strong` ("Prompt mejorado", ✓); the default labels are translated automatically. The optional `label` overrides the heading, e.g. "Plantilla" ("Template") or "Mensajes de ajuste" ("Follow-up messages"). Line breaks inside are preserved. With `copy`, a "Copiar" button copies the prompt as plain text (lists keep their "- " or "1. "); every template in the prompt library has it.

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

**Resumen**: the "En resumen" ("In summary") box that closes every step. The optional `title` changes the heading.

```mdx
<Resumen>
- Primera idea clave.
- Segunda idea clave.
</Resumen>
```

## 4b. Figures (diagrams)

Figures are diagrams drawn in HTML and CSS with the site's colors, so they follow light/dark mode, wrap on phones and print with the module. All their text comes from props, so each language file writes its own. Keep labels to a few words. Every figure takes an optional `caption`, shown below it. Step 4 (`escribir-prompts.mdx`) uses the first four below and Step 1 the next four; every other step uses the rest. Look at how a step's MDX uses a figure before reusing it elsewhere.

**AiAssumes**: a vague prompt and what the AI has to guess around it.

```mdx
<AiAssumes
  prompt="Hazme un taller de fracciones."
  guesses={['¿Grado?', '¿Objetivo?', '¿Nivel?', '¿Formato?']}
  ai="IA"
  caption="Con un prompt vago, la IA tiene que suponer todo lo que no le dijiste."
/>
```

**PromptAnatomy** + **PromptPart**: a prompt card split into its ingredients. `n` is the ingredient number from the Paso 4 table (1 rol … 6 criterios); it sets the badge and the color. `label` on PromptAnatomy is the card heading (default "Prompt").

```mdx
<PromptAnatomy label="Un prompt, seis ingredientes" caption="…">
<PromptPart n={1} label="Rol">
Actúa como docente de matemáticas de primaria…
</PromptPart>
<PromptPart n={3} label="Objetivo de aprendizaje">
Objetivo: que reconozcan fracciones equivalentes.
</PromptPart>
</PromptAnatomy>
```

**DraftLoop**: exactly four steps in a clockwise loop, plus the way out (`exit`), which comes out of the third step.

```mdx
<DraftLoop steps={['Pide', 'Recibe un borrador', 'Revísalo', 'Ajusta']} exit="Úsalo en clase" caption="…" />
```

**ClearFramework**: two groups of tiles; each word's first letter is shown large, so the words must spell the acronym.

```mdx
<ClearFramework beforeLabel="Antes de enviarlo" before={['Conciso', 'Lógico', 'Explícito']} afterLabel="Después de leer la respuesta" after={['Adaptativo', 'Reflexivo']} caption="…" />
```

**PromptFormats**: one prompt in, new content out in several formats. `icon` is `texto`, `imagen`, `audio`, `video` or `codigo` and stays in Spanish in every language.

```mdx
<PromptFormats
  label="Tu prompt"
  prompt="Explica el ciclo del agua para estudiantes de grado 3."
  ai="IA"
  formats={[
    { icon: 'texto', name: 'Texto', example: 'una explicación' },
    { icon: 'imagen', name: 'Imagen', example: 'un diagrama' },
  ]}
  caption="…"
/>
```

**NextWord** (animated): a sentence, the candidate next words and a bar for how well each fits (`fit`, 0–100). The best one is chosen and typed into the sentence. Say in the caption that it's illustrative.

```mdx
<NextWord text="Las plantas fabrican su propio" options={[{ word: 'alimento', fit: 85 }, { word: 'abono', fit: 30 }]} chosenLabel="Encaja mejor" caption="Ejemplo ilustrativo. …" />
```

**RoleFlow** + **RoleStep**: who does what, in order. `who` is `docente` or `ia` (it sets the icon and color); `title` is what the reader sees.

```mdx
<RoleFlow caption="…">
<RoleStep who="docente" title="Tú">
Decides qué enseñar, para quién y para qué.
</RoleStep>
<RoleStep who="ia" title="La IA">
Redacta un borrador en segundos.
</RoleStep>
</RoleFlow>
```

**AnnotatedAnswer** + **Flag**: an AI answer with problems marked in the text, explained by the numbered `notes`. Say in `label` that it's a made-up example, and make sure each note states the correct fact (verified).

```mdx
<AnnotatedAnswer label="Respuesta de la IA · ejemplo inventado" notes={['Falso: …', 'Cifra inventada: …']} caption="…">
El río Magdalena es el más importante de Colombia. <Flag n={1}>Nace en la Sierra Nevada de Santa Marta</Flag> y desemboca…
</AnnotatedAnswer>
```

**Matrix**: a real table crossing two kinds of choices, with marked cells (`row`/`col` counted from 1; without `text` a mark shows a check). `progress` adds an arrow: the columns go from left to right. Used for the adaptation matrix (Paso 2), the UNESCO competencies (Paso 7) and the template map (Paso 8).

```mdx
<Matrix colsLabel="¿Qué adapto?" cols={['Contenido', 'Proceso', 'Producto']} rowsLabel="¿Según qué?" rows={['Preparación', 'Intereses', 'Perfil']} marks={[{ row: 1, col: 1 }, { row: 1, col: 2, text: '2, 5' }]} caption="…" />
```

**HelpZones**: the zone of proximal development as three rings with a numbered legend; `zones` go from the inner ring outwards and the middle one is highlighted (Paso 2).

**SameGoal**: versions with 1–3 dots of support (`support`), all pointing at one shared goal (Pasos 2 and 5).

```mdx
<SameGoal versions={[{ title: 'Versión A', text: 'Más apoyo…', support: 3 }, { title: 'Versión C', text: 'Reto…', support: 1 }]} supportLabel="Apoyos" goalLabel="Mismo objetivo" goal="…" caption="…" />
```

**DecisionFlow** + **Decision**: yes/no questions in order. Leave out `yes` when "yes" just means "go on to the next question" (Paso 6); the "Sí"/"No" labels come from `figure.yes`/`figure.no` in `src/i18n/ui/`.

```mdx
<DecisionFlow caption="…">
<Decision question="¿Puedes verificarlo en una fuente confiable?" no="No lo uses." />
<Decision question="¿Es correcto y adecuado?" yes="Úsalo." no="Corrígelo y vuelve a revisarlo." />
</DecisionFlow>
```

**ToolTest**: one prompt in several tools, compared question by question; each answer is `true` (✓), `false` (✗) or a short text (Paso 3).

**CreationCycle** + **CycleStep**: the six-step cycle of Paso 5 as a loop, with `who` (`docente` or `ia`) on each step. It assumes exactly six steps.

**DataToNeeds**: personal data crossed out, next to the need to write instead (Paso 7).

```mdx
<DataToNeeds fromLabel="En lugar de" toLabel="Escribe" pairs={[{ from: 'tiene TDAH', to: 'necesita instrucciones cortas…' }]} caption="…" />
```

**TemplateFill**: a template with its `[placeholders]` and the same text filled in; `values` fill the placeholders in order (Paso 8).

```mdx
<TemplateFill templateLabel="Plantilla" filledLabel="Tu versión" template="Actúa como docente de [área]…" values={['ciencias sociales']} caption="…" />
```

**ToolPicker** (animated, loops): a teacher's need appears and a highlight picks the tool that fits it, then the next need (Paso 3). `brand` (`chatgpt`, `gemini`, `copilot` or `claude`) only sets the tile's color: the tiles use each tool's recognizable color, never its logo. Take each `need` from the step's tools table, one per tool, so no tool looks like "the best"; without animation it shows each tool with its need.

```mdx
<ToolPicker tools={[{ brand: 'gemini', name: 'Gemini', need: 'Mi colegio usa Google Workspace.' }]} caption="Ejemplo ilustrativo: …" />
```

**Animation.** Animate a figure only when the motion is the lesson (NextWord shows an answer being built word by word; the home page's TeacherAiScene tells the guide's "ask, draft, review" story). An animation plays once when it scrolls into view and shows its finished state without JavaScript, with reduced motion and in print. Use CSS keyframes and `playOnView()` from `src/lib/animation.ts`, not an animation library, with an `<AnimationButton />` under the figure: a replay button ("Ver de nuevo"), or, if the animation lasts more than 5 seconds, `<AnimationButton pausable />` ("Pausar" / "Continuar" while it plays) plus a `[data-clock]` element whose animation lasts the whole timeline, so the button knows when it ends. With `loop`, the animation starts again each time the clock ends (after `onLoop`, which can change what the next loop shows, as ToolPicker does) and holds while it's out of view; a looping animation must always be pausable (WCAG 2.2.2), so the home scene uses `<AnimationButton pausable discreet />` (it only appears when a keyboard user tabs to it) and `pauseOnClick` (clicking or tapping the scene pauses it). The labels are `figure.*` in `src/i18n/ui/`.

Use at most one figure per `##` section, next to the text it illustrates, never between a sentence ending in ":" and its list. A new kind of diagram is a new component in `src/components/` built on `Figure.astro` (code work, not content work).

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

## 6. Writing style (Spanish, for teachers; §1b for English)

- Address the reader as **"tú"**. Use short sentences and one idea per paragraph.
- **Plain language first, theory second.** Explain the idea in classroom terms, then name the author: "el andamiaje justo (Vygotsky)". Keep inline citations sparse, (Autor, año), and put the full list in `sources`.
- Define a technical term the first time it appears, and add it to `glosario.mdx` (alphabetical, `**Término.** Definición.`).
- **Colombian context**: grados, pesos, colegio público or privado, MEN Estándares and DBA, local places and food (arepas, la tienda del barrio, Bucaramanga, Santander).
- Spread examples across levels (preescolar to secundaria) and subjects (matemáticas, lenguaje, ciencias, sociales, educación infantil, filosofía).
- Use inclusive language and diverse names and situations.
- **Privacy rule in every example:** prompts describe the group or a need, never a real student. Write "un estudiante de grado 6 que necesita instrucciones cortas", not a name or diagnosis.
- Use sentence-case headings and no emoji. "Prompt" stays in English, as the guide defines it in Paso 4.

## 7. Prompt templates (Paso 8)

New templates in `biblioteca-de-prompts.mdx` follow this exact block, continuing the numbering (in English: "Adapts / Based on / Ideal for", label "Template", "Example of use"):

```mdx
## 12. Título de la plantilla

**Qué adapta:** contenido · **Según:** preparación · **Ideal para:** cualquier área.

<PromptExample label="Plantilla" copy>
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

- New source: add the short form to the module's `sources`, and the full **APA 7** entry to `referencias.mdx` in the right section (in both languages) (Fuentes académicas, Organismos internacionales, Normativa y política pública de Colombia, Herramientas), in alphabetical order.
- **Time-sensitive facts** (tool features, prices, age limits, laws, policies): verify them on the web before writing, and record the date. The Paso 3 tool table says "revisados en octubre de 2026", and the "Herramientas" entry in `referencias.mdx` has the same date; update both together, in both languages.
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
- When the author releases a revised version, update the "Versión base" callout in `acerca.mdx` (e.g. "Versión 2 — ajustada con los aportes de …"), the "Base version" callout in `en/acerca.mdx`, and `footer.edition` in `src/i18n/ui/`.

## 11. Verify before finishing

```sh
npm run lint && npm run typecheck && npm test && npm run build
grep -rn 'href="/' dist | grep -v 'href="/guia-genia-edu' || echo "links OK"
```

Then open the changed page in the dev server (`astro dev --background`, http://localhost:4321/guia-genia-edu/guia/<slug>/ and /guia-genia-edu/en/guia/<slug>/) and check the sidebar, "En esta página", the components and the Resumen. If pages show no content, see the stale-cache gotcha in CLAUDE.md.
