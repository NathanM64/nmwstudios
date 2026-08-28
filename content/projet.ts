// Ce qu'il faut sur la table avant de commencer. L'ordre est celui du démarrage réel, et la
// dernière étape est une porte : rien ne se travaille avant elle.
export type Prealable = { titre: string; corps: string }

export const PREALABLES: Prealable[] = [
  {
    titre: 'Les maquettes, s’il y en a',
    corps:
      "Elles ne sont pas obligatoires. Sans elles le projet part quand même, mais chaque écran se décide en cours de route, et ça se voit sur le nombre de jours.",
  },
  {
    titre: 'Les fonctionnalités, détaillées',
    corps:
      "Pas une liste de titres : ce que fait chaque fonctionnalité, pour qui, et dans quel cas elle ne s'applique pas. C'est là que se cachent les jours qu'on n'avait pas comptés.",
  },
  {
    titre: 'Les choix techniques qui ne se discutent plus',
    corps:
      "Un hébergement imposé, une base de données qui existe déjà, un outil auquel il faut se brancher. Mieux vaut les connaître avant l'estimation qu'après.",
  },
  {
    titre: 'Votre validation pour démarrer',
    corps:
      "Vous avez l'estimation en jours, vous dites oui, je m'y mets. Rien n'est travaillé avant ce oui.",
  },
]

// Les trois règles du chiffrage. La troisième est celle qu'on ne lit nulle part ailleurs :
// une estimation qui ne peut que baisser n'a pas le même sens qu'un forfait.
export const CHIFFRAGE: string[] = [
  'Une journée de travail, c’est 7 h 30. C’est l’unité, et elle ne bouge pas.',
  'Vous avez l’estimation en jours avant que je commence, et rien ne commence sans votre accord.',
  'Ce qui est facturé est le temps passé. Si je finis en avance, vous ne payez pas la différence.',
]

// Des ordres de grandeur, pas des forfaits. Le site n'affiche toujours qu'un seul prix : ces
// durées se multiplient par le même TJM, et chaque projet est réestimé sur ce qu'il contient.
export type Repere = { projet: string; jours: string; precision: string }

export const REPERES: Repere[] = [
  {
    projet: 'Site vitrine de plusieurs pages',
    jours: '3 jours',
    precision: 'Mise en place de l’hébergement comprise.',
  },
  {
    projet: 'Backoffice simple',
    jours: '5 jours',
    precision: 'Authentification, listes, formulaires, exports.',
  },
]

// Ce que couvre l'après. Volontairement sans forfait : le tarif reste le seul du site.
export const APRES: string[] = [
  'L’hébergement, si vous préférez que je le prenne en charge.',
  'La maintenance, au besoin plutôt qu’au forfait.',
  'Les fonctionnalités suivantes, quand elles arrivent.',
]
