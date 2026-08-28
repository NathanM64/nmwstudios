// What has to be on the table before starting. The order is that of a real kick-off, and the
// last step is a gate: nothing is worked on before it.
export type Prerequisite = { title: string; body: string }

export const PREREQUISITES: Prerequisite[] = [
  {
    title: 'Les maquettes, s’il y en a',
    body:
      "Elles ne sont pas obligatoires. Sans elles le projet part quand même, mais chaque écran se décide en cours de route, et ça se voit sur le nombre de jours.",
  },
  {
    title: 'Les fonctionnalités, détaillées',
    body:
      "Pas une liste de titres : ce que fait chaque fonctionnalité, pour qui, et dans quel cas elle ne s'applique pas. C'est là que se cachent les jours qu'on n'avait pas comptés.",
  },
  {
    title: 'Les choix techniques qui ne se discutent plus',
    body:
      "Un hébergement imposé, une base de données qui existe déjà, un outil auquel il faut se brancher. Mieux vaut les connaître avant l'estimation qu'après.",
  },
  {
    title: 'Votre validation pour démarrer',
    body:
      "Vous avez l'estimation en jours, vous dites oui, je m'y mets. Rien n'est travaillé avant ce oui.",
  },
]

// The three pricing rules. The third one is the one you read nowhere else: an estimate that
// can only go down does not mean the same thing as a fixed price.
export const PRICING_RULES: string[] = [
  'Une journée de travail, c’est 7 h 30. C’est l’unité, et elle ne bouge pas.',
  'Vous avez l’estimation en jours avant que je commence, et rien ne commence sans votre accord.',
  'Ce qui est facturé est le temps passé. Si je finis en avance, vous ne payez pas la différence.',
]

// Ballpark figures, not fixed prices. The site still shows a single price: these durations
// multiply by the same day rate, and every project is re-estimated on what it actually holds.
export type Benchmark = { project: string; days: string; detail: string }

export const BENCHMARKS: Benchmark[] = [
  {
    project: 'Site vitrine de plusieurs pages',
    days: '3 jours',
    detail: 'Mise en place de l’hébergement comprise.',
  },
  {
    project: 'Backoffice simple',
    days: '5 jours',
    detail: 'Authentification, listes, formulaires, exports.',
  },
]

// What the aftermath covers. Deliberately without a package: the rate stays the only one.
export const AFTER_LAUNCH: string[] = [
  'L’hébergement, si vous préférez que je le prenne en charge.',
  'La maintenance, au besoin plutôt qu’au forfait.',
  'Les fonctionnalités suivantes, quand elles arrivent.',
]
