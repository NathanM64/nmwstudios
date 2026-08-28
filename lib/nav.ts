// La même liste sert l'en-tête et le pied : sous 768 px la barre ne peut plus tenir trois
// liens, c'est le pied qui porte la navigation. Deux listes divergeraient à la première page
// ajoutée.
export const NAV = [
  { href: '/renfort/', texte: 'Renfort ponctuel' },
  { href: '/projet-complet/', texte: 'Projet complet' },
  { href: '/reprise-et-maintenance/', texte: 'Reprise et maintenance' },
] as const
