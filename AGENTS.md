# Project rules

Astro 7 + React 19 site. Node version is pinned in `.nvmrc` (run `nvm use` first).

## Commands
- Install: `npm install`
- Dev server: `npm run dev` (for agents: `astro dev --background`, see Development below)
- Build: `npm run build`
- Test: `npm test` (Vitest, single run) / `npm run test:watch`
- Lint: `npm run lint` / `npm run lint:fix` (ESLint)
- Typecheck: `npm run typecheck` (`astro check`)

Before finishing a change, run `npm run lint`, `npm run typecheck`, and `npm test`.

## Architecture
```
public/              Static assets served as-is (favicon, robots.txt, images)
src/
  pages/             File-based routes (.astro); keep them thin, compose layouts + components
  layouts/           Page shells (.astro): <html>, <head>, shared header/footer
  components/        UI components
    *.astro          Static, server-rendered components (default choice)
    *.tsx            React components, only when interactivity/state is needed
  hooks/             Custom React hooks (useX.ts)
  lib/               Framework-agnostic utilities, API clients, types
  styles/            Global CSS
  content/           Content collections (Markdown/MDX), if used
```

- Default to `.astro` components; use React only for interactive islands.
- Hydrate React components explicitly with a `client:*` directive (`client:load`, `client:visible`, `client:idle`); prefer the laziest one that works.
- React components are default-exported, PascalCase, one per file.
- Tests are colocated next to the source: `Component.test.tsx`, `util.test.ts`. Use Testing Library, querying by role/label.

## Conventions
- TypeScript strict mode, no `any` (use `unknown` and narrow, or proper types)
- Conventional commits (feat:, fix:, chore:)
- Never edit files in `legacy/`
- TypeScript is pinned to 6.x: `typescript-eslint` and `astro check` don't support TS 7 yet. Don't upgrade it.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
