// A real sequence: each step needs the previous one. The number carries information, it does
// not decorate. No duration is ever announced: the first step says itself that start-up time
// depends on the state of the project, and a reader whose fear is the delay reads "two weeks"
// as two weeks before anything starts at all.
export type Step = { title: string; body: string }

export const ASSESSMENT: Step[] = [
  {
    title: 'Le projet démarre sur ma machine',
    body:
      "Ça paraît trivial. C’est la première chose qui échoue, et le temps que ça prend dit déjà beaucoup de l’état du projet.",
  },
  {
    title: "Les accès et l’historique passent à votre nom",
    body:
      "Dépôt Git, hébergement, nom de domaine, comptes de service. Je liste ce qui existe, ce qui manque, et ce qui est resté au nom d’un ancien prestataire.",
  },
  {
    title: 'Je sépare ce qui casse, ce qui est risqué et ce qui est seulement laid',
    body:
      "Trois piles distinctes. La troisième est la plus grosse, et c’est celle sur laquelle il ne faut surtout pas dépenser votre budget.",
  },
  {
    title: 'Vous recevez le tout par écrit, dans un ordre',
    body:
      'Ce qui doit être fait maintenant, ce qui peut attendre, ce qui ne vaut pas le coup. Avec une estimation en jours pour chaque ligne. Vous décidez ensuite.',
  },
]
