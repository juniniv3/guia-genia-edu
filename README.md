# Guía GenIA Edu

Guía pedagógica para docentes sobre el uso de la **inteligencia artificial generativa** en la creación de **material didáctico adaptativo**, con criterio pedagógico, ético y responsable.

**Sitio publicado:** https://juniniv3.github.io/guia-genia-edu/

## Contenido de la guía

Una ruta de 8 pasos escrita en lenguaje sencillo para docentes de cualquier nivel y área:

1. ¿Qué es la IA generativa?
2. ¿Qué es un material didáctico adaptativo? (enseñanza diferenciada y DUA)
3. Cómo elegir una herramienta de IA
4. Cómo pedirle a la IA: escribir buenos prompts
5. Crear un material paso a paso
6. Revisar la calidad de lo que genera la IA
7. Uso ético y responsable
8. Biblioteca de prompts

Además incluye un glosario, las referencias completas y una página "Acerca de".

## Origen

La guía es el producto del trabajo de grado *"Guía pedagógica para el uso de IA generativa en la creación de materiales adaptativos: una experiencia en la Maestría en Educación UNAB"*, de la Universidad Autónoma de Bucaramanga.

- **Autor:** Luis Jesús Flórez Moreno
- **Dirección:** PhD Laura Milena Palacios Mora

La investigación sigue un diseño de investigación-acción: la guía se ajusta en cada ciclo a partir de las percepciones de los docentes que la usan.

## Requisitos

- Node.js 22.12 o superior (la versión del proyecto está en `.nvmrc`). Con nvm: `nvm use`.

## Comandos

| Comando | Acción |
| --- | --- |
| `npm install` | Instala las dependencias |
| `npm run dev` | Inicia el servidor local en http://localhost:4321/guia-genia-edu/ |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve localmente la versión generada |
| `npm test` | Ejecuta las pruebas (Vitest) |
| `npm run lint` | Revisa el código con ESLint |
| `npm run typecheck` | Revisa los tipos y los archivos Astro (`astro check`) |

## Cómo editar el contenido

Todo el texto de la guía está en `src/content/modulos/`, un archivo `.mdx` por página. El nombre del archivo es la dirección de la página (por ejemplo, `escribir-prompts.mdx` se publica en `/guia/escribir-prompts/`).

- **Editar un paso:** abre su archivo y cambia el texto. Es Markdown con algunos componentes para destacar ideas (`Callout`), mostrar prompts (`PromptExample`, `BeforeAfter`) y cerrar con un resumen (`Resumen`).
- **Agregar un paso:** crea un archivo nuevo con el encabezado (frontmatter) completo y un valor de `order`. El menú, la página de inicio y los botones de anterior y siguiente se actualizan solos. Si cambia la numeración, revisa las referencias del tipo "ver Paso 6" en los demás módulos.
- **Agregar una fuente:** añádela en `sources` del módulo y la referencia completa (APA 7) en `referencias.mdx`.

Si trabajas con Claude Code, la habilidad `guide-content` (en `.claude/skills/guide-content/`) contiene todas las reglas de contenido, estilo y formato, y se activa sola al pedir cambios en la guía. `CLAUDE.md` describe la arquitectura y las convenciones del proyecto.

## Estructura del proyecto

```text
src/
├── content/modulos/   Texto de la guía (un .mdx por página)
├── content.config.ts  Esquema de los módulos
├── pages/             Inicio y la ruta dinámica /guia/<módulo>/
├── layouts/           Plantillas de página (general y de módulo)
├── components/        Encabezado, menú, tarjetas y componentes para MDX
├── lib/               Utilidades (rutas con base, orden de los módulos)
└── styles/global.css  Colores, tipografía y estilos de impresión
```

## Publicación

El sitio se publica en GitHub Pages. Cada cambio que llega a `main` ejecuta el flujo `.github/workflows/deploy.yml`, que construye y publica el sitio. El flujo `ci.yml` revisa el lint, los tipos, las pruebas y la construcción en cada cambio a `main` y en cada pull request.
