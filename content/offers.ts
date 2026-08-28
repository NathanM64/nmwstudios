// The three ways in. The order follows increasing commitment, and the third one carries the
// visual weight: it is the one that lasts.
export type Offer = {
  id: string
  title: string
  trigger: string
  body: string
  commitment: string
  primary?: boolean
  link?: { href: string; label: string }
}

export const OFFERS: Offer[] = [
  {
    id: 'renfort',
    title: 'Renfort ponctuel',
    trigger: 'Vous avez la charge, pas les bras.',
    body:
      'Je prends une partie de votre production pendant un pic : une intégration, une API à brancher, une mise en production qui traîne. Vous gardez la main sur le projet.',
    commitment: 'À la journée, sans durée minimum.',
    link: { href: '/renfort/', label: 'Comment ça se passe' },
  },
  {
    id: 'projet',
    title: 'Projet complet',
    trigger: 'Vous avez vendu, il faut livrer.',
    body:
      'Vous avez la maquette et le client, je fais le développement, de la première ligne à la mise en ligne. Vous restez le seul interlocuteur.',
    commitment: 'Un périmètre, une estimation en jours, un devis.',
    link: { href: '/projet-complet/', label: 'Comment ça se passe' },
  },
  {
    id: 'reprise',
    title: 'Reprise et maintenance',
    trigger: "Vous avez hérité d’un site que personne ne veut toucher.",
    body:
      "Un projet développé ailleurs, par quelqu’un qui n’est plus là. Je le reprends, je le garde en vie et je le fais avancer, sans repartir de zéro.",
    commitment: 'Au mois, une enveloppe de jours convenue à l’avance, résiliable.',
    primary: true,
    link: { href: '/reprise-et-maintenance/', label: 'Comment ça se passe' },
  },
]
