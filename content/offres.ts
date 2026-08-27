// Les trois manières d’entrer en relation. L’ordre est celui de l’engagement croissant,
// et la troisième porte le poids visuel : c’est celle qui dure.
export type Offre = {
  id: string
  titre: string
  declencheur: string
  corps: string
  engagement: string
  dominante?: boolean
  lien?: { href: string; texte: string }
}

export const OFFRES: Offre[] = [
  {
    id: 'renfort',
    titre: 'Renfort ponctuel',
    declencheur: 'Vous avez la charge, pas les bras.',
    corps:
      'Je prends une partie de votre production pendant un pic : une intégration, une API à brancher, une mise en production qui traîne. Vous gardez la main sur le projet.',
    engagement: 'À la journée, sans durée minimum.',
  },
  {
    id: 'projet',
    titre: 'Projet complet',
    declencheur: 'Vous avez vendu, il faut livrer.',
    corps:
      'Vous avez la maquette et le client, je fais le développement, de la première ligne à la mise en ligne. Vous restez le seul interlocuteur.',
    engagement: 'Un périmètre, une estimation en jours, un devis.',
  },
  {
    id: 'reprise',
    titre: 'Reprise et maintenance',
    declencheur: "Vous avez hérité d’un site que personne ne veut toucher.",
    corps:
      "Un projet développé ailleurs, par quelqu’un qui n’est plus là. Je le reprends, je le garde en vie et je le fais avancer, sans repartir de zéro.",
    engagement: 'Au mois, résiliable.',
    dominante: true,
    lien: { href: '/reprise-et-maintenance/', texte: 'Comment ça se passe' },
  },
]
