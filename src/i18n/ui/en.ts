import type { Dictionary } from './es';

/** English UI strings. Typed against the Spanish dictionary, so a missing or extra key fails the typecheck. */
export const en: Dictionary = {
  site: {
    tagline: 'Generative AI for creating adaptive teaching materials',
  },
  skipLink: 'Skip to content',
  header: {
    navLabel: 'Main',
    home: 'Home',
    guide: 'The guide',
    prompts: 'Prompts',
    glossary: 'Glossary',
    about: 'About',
  },
  languagePicker: {
    label: 'Language',
  },
  footer: {
    edition: 'base version',
    credits:
      'A research product of the Master’s in Education, Universidad Autónoma de Bucaramanga (UNAB), Colombia. Author: Luis Jesús Flórez Moreno. Advisor: Laura Milena Palacios Mora, PhD.',
    reminder: 'Remember: teachers should review all AI-generated content before taking it into the classroom.',
    navLabel: 'Footer',
    glossary: 'Glossary',
    references: 'References',
    about: 'About the guide',
  },
  nav: {
    label: 'Guide steps',
    route: 'The path',
    resources: 'Resources',
    step: (n) => `Step ${n}`,
  },
  module: {
    position: (step, total) => `Step ${step} of ${total}`,
    readingTime: (minutes) => `${minutes} min read`,
    allSteps: 'See all steps',
    onThisPage: 'On this page',
    sources: 'Sources for this module',
    seeReferences: 'Full details are in the {link}.',
    references: 'References',
    untranslatedTitle: 'Not translated yet',
    untranslated:
      'This page hasn’t been translated into English yet, so it’s shown in Spanish, the language the guide was written in.',
  },
  prevNext: {
    label: 'Step navigation',
    finishedTitle: 'You’ve finished the path!',
    finished: 'Come back to the guide whenever you need it. See the {glossary} or the {references} to go deeper.',
    glossary: 'glossary',
    references: 'references',
  },
  callout: {
    idea: 'Key idea',
    consejo: 'Tip',
    cuidado: 'Watch out',
    ejemplo: 'Example',
  },
  prompt: {
    neutral: 'Prompt',
    weak: 'Weak prompt',
    strong: 'Improved prompt',
  },
  summary: 'In summary',
  figure: {
    replay: 'Play again',
  },
  home: {
    description:
      'A teaching guide for educators: how to use generative artificial intelligence to create adaptive teaching materials with sound pedagogical, ethical and responsible judgment.',
    eyebrow: 'A teaching guide for educators',
    title: 'Create adaptive teaching materials with generative artificial intelligence',
    lead: (steps) =>
      `A practical ${steps}-step path for using tools like ChatGPT, Gemini, Copilot or Claude with sound pedagogical, ethical and responsible judgment, so you can better respond to the diversity of your classroom.`,
    start: 'Start the guide →',
    seePrompts: 'See prompt examples',
    principleQuote: '“You decide; AI assists.”',
    principle:
      'Generative AI can produce drafts in seconds, but it doesn’t know your students. What to teach, to whom, how and why is still your decision. This guide follows the human-centered approach proposed by UNESCO: technology in the service of educational goals, with the teacher in charge.',
    audienceTitle: 'Who is this guide for?',
    audiences: [
      {
        title: 'Teachers of any level and subject',
        text: 'From preschool to higher education: the examples cover math, language arts, science, early childhood education and philosophy.',
      },
      {
        title: 'No technical knowledge needed',
        text: 'You don’t need to know how to code. Everything is explained in plain words with classroom examples.',
      },
      {
        title: 'Those who already use AI and want to do it better',
        text: 'You’ll find criteria for asking, reviewing and adapting with pedagogical intent, not just “trying it and seeing what comes out”.',
      },
    ],
    routeTitle: (steps) => `The path in ${steps} steps`,
    routeIntro: (minutes) =>
      `About ${minutes} minutes of reading in total. Follow it in order or go straight to the step you need.`,
    outcomesTitle: 'By the end, you’ll be able to…',
    outcomes: [
      'Understand what generative AI is, what it can do for you and what its limits are.',
      'Recognize when a material is truly adaptive and what you can adapt.',
      'Write clear prompts with six basic ingredients.',
      'Follow a creation cycle: plan, ask, review, adjust, apply and reflect.',
      'Check the quality of what AI generates before taking it into the classroom.',
      'Use AI ethically: protect data, be transparent and look after equity.',
    ],
    resourcesTitle: 'Resources',
  },
};
