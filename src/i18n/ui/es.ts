/**
 * Spanish UI strings: the site chrome and the home page. Guide text lives in `src/content/modulos/<locale>/`.
 * This dictionary is the source of truth; its shape is the `Dictionary` type every other locale must match.
 * `{name}` placeholders are filled with markup by the `Trans` component; numbers use functions.
 */
export const es = {
  site: {
    tagline: 'IA generativa para crear material didáctico adaptativo',
  },
  skipLink: 'Saltar al contenido',
  header: {
    navLabel: 'Principal',
    home: 'Inicio',
    guide: 'La guía',
    prompts: 'Prompts',
    glossary: 'Glosario',
    about: 'Acerca',
  },
  languagePicker: {
    label: 'Idioma',
  },
  footer: {
    edition: 'versión base',
    credits:
      'Producto de investigación de la Maestría en Educación, Universidad Autónoma de Bucaramanga (UNAB). Autor: Luis Jesús Flórez Moreno. Dirección: PhD Laura Milena Palacios Mora.',
    reminder: 'Recuerda: todo contenido generado con IA debe ser revisado por el docente antes de llevarlo al aula.',
    navLabel: 'Pie de página',
    glossary: 'Glosario',
    references: 'Referencias',
    about: 'Acerca de la guía',
  },
  nav: {
    label: 'Pasos de la guía',
    route: 'La ruta',
    resources: 'Recursos',
    step: (n: number) => `Paso ${n}`,
  },
  module: {
    position: (step: number, total: number) => `Paso ${step} de ${total}`,
    readingTime: (minutes: number) => `${minutes} min de lectura`,
    allSteps: 'Ver todos los pasos',
    onThisPage: 'En esta página',
    sources: 'Fuentes de este módulo',
    seeReferences: 'Consulta los datos completos en {link}.',
    references: 'Referencias',
    untranslatedTitle: 'Página en su idioma original',
    untranslated: 'Esta página todavía no está traducida, así que la ves en el idioma en que se escribió.',
  },
  prevNext: {
    label: 'Navegación entre pasos',
    finishedTitle: '¡Terminaste la ruta!',
    finished: 'Vuelve a la guía cada vez que lo necesites. Consulta el {glossary} o las {references} para profundizar.',
    glossary: 'glosario',
    references: 'referencias',
  },
  callout: {
    idea: 'Idea clave',
    consejo: 'Consejo',
    cuidado: 'Cuidado',
    ejemplo: 'Ejemplo',
  },
  prompt: {
    neutral: 'Prompt',
    weak: 'Prompt débil',
    strong: 'Prompt mejorado',
  },
  summary: 'En resumen',
  figure: {
    replay: 'Ver de nuevo',
    yes: 'Sí',
    no: 'No',
    continue: 'sigue con la siguiente pregunta',
    pause: 'Pausar la animación',
    resume: 'Continuar la animación',
  },
  home: {
    description:
      'Guía pedagógica para docentes: cómo usar la inteligencia artificial generativa para crear material didáctico adaptativo con criterio pedagógico, ético y responsable.',
    eyebrow: 'Guía pedagógica para docentes',
    title: 'Crea material didáctico adaptativo con inteligencia artificial generativa',
    lead: (steps: number) =>
      `Una ruta práctica de ${steps} pasos para usar herramientas como ChatGPT, Gemini, Copilot o Claude con criterio pedagógico, ético y responsable, y así responder mejor a la diversidad de tu aula.`,
    start: 'Empezar la guía →',
    seePrompts: 'Ver ejemplos de prompts',
    sceneTitle: 'Una docente trabaja con la IA',
    sceneDescription:
      'La docente escribe su pedido, la IA piensa y le entrega un borrador, y ella lo revisa, lo corrige y lo aprueba.',
    principleQuote: '“Tú decides, la IA asiste.”',
    principle:
      'La IA generativa puede producir borradores en segundos, pero no conoce a tus estudiantes. Qué enseñar, para quién, cómo y por qué sigue siendo una decisión tuya. Esta guía sigue el enfoque centrado en el ser humano que propone la UNESCO: la tecnología al servicio de los fines educativos, con el docente al mando.',
    audienceTitle: '¿Para quién es esta guía?',
    audiences: [
      {
        title: 'Docentes de cualquier nivel y área',
        text: 'Desde preescolar hasta educación superior: los ejemplos cubren matemáticas, lenguaje, ciencias, educación infantil y filosofía.',
      },
      {
        title: 'Sin conocimientos técnicos',
        text: 'No necesitas saber programar. Todo se explica con palabras sencillas y ejemplos de aula.',
      },
      {
        title: 'Quienes ya usan IA y quieren hacerlo mejor',
        text: 'Encontrarás criterios para pedir, revisar y adaptar con intención pedagógica, no solo “probar a ver qué sale”.',
      },
    ],
    routeTitle: (steps: number) => `La ruta en ${steps} pasos`,
    routeIntro: (minutes: number) =>
      `Unos ${minutes} minutos de lectura en total. Puedes seguirla en orden o ir directo al paso que necesites.`,
    outcomesTitle: 'Al terminar podrás…',
    outcomes: [
      'Entender qué es la IA generativa, qué puede hacer por ti y cuáles son sus límites.',
      'Reconocer cuándo un material es realmente adaptativo y qué puedes adaptar.',
      'Escribir prompts claros con seis ingredientes básicos.',
      'Seguir un ciclo de creación: planear, pedir, revisar, ajustar, aplicar y reflexionar.',
      'Revisar la calidad de lo que genera la IA antes de llevarlo al aula.',
      'Usar la IA de forma ética: proteger datos, ser transparente y cuidar la equidad.',
    ],
    resourcesTitle: 'Recursos',
  },
};

export type Dictionary = typeof es;
