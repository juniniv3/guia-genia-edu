# Project rules

**Guía GenIA Edu**: a Spanish-language website, with an English translation, that teaches *teachers* how to use generative AI to create adaptive teaching material. It is the product of a Master's in Education thesis at UNAB (Universidad Autónoma de Bucaramanga, Colombia). The guide is evaluated in teacher interviews and revised in action-research cycles, so **content edits are the most common task: use the `guide-content` skill for them.**

The site's readers are non-technical teachers: content is plain Spanish (the original) and plain English (a translation). Code, comments and these docs are in English.

Astro 7 + MDX + React 19. The site is fully static. React is installed but there are no islands: the guide is intentionally content-only for now, so don't add interactive widgets unless asked. Node ≥ 22.12 is required; the version is pinned in `.nvmrc` (run `nvm use` first).

## Commands
- Install: `npm install`
- Dev server: `npm run dev` (for agents: `astro dev --background`, see Development below)
- Build: `npm run build`
- Test: `npm test` (Vitest, single run) / `npm run test:watch`
- Lint: `npm run lint` / `npm run lint:fix` (ESLint)
- Typecheck: `npm run typecheck` (`astro check`)

Before finishing a change, run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. Content schema and MDX syntax errors only surface at build time.

## Architecture
```
public/                  Static assets (favicon.svg)
src/
  content.config.ts      Schema of the `modulos` collection
  content/modulos/
    es/*.mdx             ALL guide text, one file per page; the file name is the URL slug
    en/*.mdx             English translations, same file names
  i18n/
    locales.ts           LOCALES, DEFAULT_LOCALE ('es'), toLocale(); read by astro.config.mjs
    paths.ts             localizePath(), localeHref(), translatePathname() (language switcher, hreflang)
    ui/es.ts, ui/en.ts   UI strings (chrome + home page copy); es.ts defines the Dictionary type
    ui/index.ts          getTranslations(locale)
  pages/[...locale]/     `locale` is undefined for Spanish (unprefixed) and 'en' for /en/
    index.astro          Home: hero, audience, route cards, outcomes, resources
    guia/[slug].astro    Renders every module at /guia/<slug>/ and /en/guia/<slug>/
  layouts/
    BaseLayout.astro     <html>, <head>, header, footer
    ModuleLayout.astro   Sidebar nav, "Paso X de N", TOC from the ## headings, sources, prev/next
  components/
    SiteHeader, SiteFooter, ModuleNav, PrevNext, ModuleCard, Logo   Site chrome
    LanguagePicker       ES/EN toggle in the header, links to the same page in the other language
    Trans                Renders a translated string whose {placeholders} are links/markup
    Callout, PromptExample, BeforeAfter, Resumen                    Used inside MDX
    Figure, PromptAnatomy + PromptPart, AiAssumes, DraftLoop, ClearFramework   Diagrams drawn in HTML/CSS, used inside MDX
    PromptFormats, NextWord, RoleFlow + RoleStep, AnnotatedAnswer + Flag        More diagrams (Step 1); AiIcon is the shared robot
    Matrix, HelpZones, SameGoal, DecisionFlow + Decision, ToolTest, CreationCycle + CycleStep, DataToNeeds, TemplateFill
                         Diagrams for Steps 2, 3, 5–8; PersonIcon is the shared teacher
    TeacherAiScene       Home hero: animated teacher + AI scene ("ask, draft, review"); loops, pauses on click/tap
    AnimationButton      Replay / pause button under an animated figure (driven by lib/animation.ts)
  lib/
    url.ts               withBase() / stripBase(): add or remove the deploy base
    modules.ts           localizeModules(), ordering, route vs. resources, prev/next, step number, moduleHref()
    content.ts           getModules(locale): the collection in one language (GuideModule)
    site.ts              Site name
    animation.ts         playOnView(): plays a figure's CSS animation once in view; replay and pause button
  styles/global.css      Design tokens (light/dark), prose, task-list and print styles
```

- **i18n.** Astro's built-in i18n routing: Spanish is the default locale, served unprefixed (existing URLs never change); English lives under `/en/`. Both languages share slugs, so the language switch only adds or removes the prefix.
  - Get the page language with `toLocale(Astro.currentLocale)` and UI text with `getTranslations(locale)`. Never hardcode user-facing text in components: add it to `src/i18n/ui/es.ts` and `en.ts` (the typecheck fails if a locale misses a key). Use functions for numbers (`position(step, total)`) and `{name}` placeholders with `<Trans>` for embedded links.
  - Spanish is the source of truth. `getModules(locale)` returns one module per `es/` file, using its `en/` translation when it exists and the Spanish original otherwise (marked `lang="es"`, with a "not translated yet" notice), so a new Spanish page never breaks the English build. `order` and `section` always come from the Spanish file.
- Modules with `section: ruta` are the numbered steps, ordered by `order`; `section: recursos` are the glossary, references and about pages. The sidebar, home cards, step labels and prev/next all derive from the collection, so adding a module never needs nav code changes.
- Default to `.astro` components; use React only for interactive islands. Hydrate React components explicitly with the laziest `client:*` directive that works. React components are default-exported, PascalCase, one per file.
- Deployed to GitHub Pages under `base: '/guia-genia-edu'`. Never hardcode root-absolute URLs (`/foo`): build internal links with `moduleHref(slug, locale)` or `localeHref(path, locale)` (`withBase(path)` only for locale-independent assets).
- Styling is plain CSS: use the custom properties from `global.css` and scope component styles inside the `.astro` file. No CSS frameworks. Keep AA contrast in both light and dark themes. Mark site chrome with the `no-print` class so modules print as clean handouts.
- Tests are colocated next to the source (`util.test.ts`, `Component.test.tsx`). Pure helpers live in `src/lib` and are unit-tested; use Testing Library, querying by role/label, for React components.

## Conventions
- TypeScript strict mode, no `any` (use `unknown` and narrow, or proper types)
- Conventional commits (feat:, fix:, chore:). `git commit` is denied for Claude in `.claude/settings.json`; the author commits.
- Never edit files in `legacy/`
- TypeScript is pinned to 6.x: `typescript-eslint` and `astro check` don't support TS 7 yet. Don't upgrade it.
- `ajv@^8` is a direct devDependency on purpose: it satisfies a peer dep of `@astrojs/check`'s YAML server, which otherwise resolves to eslint's `ajv@6` and breaks `npm ci` in CI. Don't remove it.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`. The site is served at http://localhost:4321/guia-genia-edu/ (note the base path).

## Gotchas
- **Empty content in dev** ("La ruta en 0 pasos", module pages 404) after switching branches or resolving merge conflicts: the content cache is stale. Run `astro dev stop && rm .astro/data-store.json`, then start again.
- **"Node.js v20 is not supported by Astro"**: on the author's machine `/usr/local/bin/node` points to Node 20, used by shells that don't load nvm. Run `nvm use` (Node 24).
- The build prints a `MODULE_LEVEL_DIRECTIVE` warning for MDX files. It comes from the MDX integration and is harmless.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [MDX integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Adding styles](https://docs.astro.build/en/guides/styling/)
