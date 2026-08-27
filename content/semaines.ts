// Une vraie séquence : chaque étape a besoin de la précédente. Le numéro porte donc une
// information, il ne décore pas.
export type Etape = { titre: string; corps: string }

export const PREMIERES_SEMAINES: Etape[] = [
  {
    titre: 'Le projet démarre sur ma machine',
    corps:
      "Ça paraît trivial. C’est la première chose qui échoue, et le temps que ça prend dit déjà beaucoup de l’état du projet.",
  },
  {
    titre: "Les accès et l’historique passent à votre nom",
    corps:
      "Dépôt Git, hébergement, nom de domaine, comptes de service. Je liste ce qui existe, ce qui manque, et ce qui est resté au nom d’un ancien prestataire.",
  },
  {
    titre: 'Je sépare ce qui casse, ce qui est risqué et ce qui est seulement laid',
    corps:
      "Trois piles distinctes. La troisième est la plus grosse, et c’est celle sur laquelle il ne faut surtout pas dépenser votre budget.",
  },
  {
    titre: 'Vous recevez le tout par écrit, dans un ordre',
    corps:
      'Ce qui doit être fait maintenant, ce qui peut attendre, ce qui ne vaut pas le coup. Avec une estimation en jours pour chaque ligne. Vous décidez ensuite.',
  },
]
