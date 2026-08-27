// Ni nom, ni logo, ni lien : le secteur et la technique suffisent à montrer qu'il y a de la
// matière derrière la discrétion. L'ancienneté en production est ce qui compte le plus,
// bien avant la pile technique.
export type Travail = { corps: string; etat?: string }

export const TRAVAUX: Travail[] = [
  {
    corps:
      "Application iPad hors ligne pour les commerciaux d’un émetteur international de cartes de paiement, avec synchronisation différée dès que le réseau revient.",
    etat: 'En production et maintenue depuis deux ans',
  },
  {
    corps: "Plateforme de gamification pour une agence marketing.",
  },
  {
    corps:
      "Plateforme industrielle de pilotage de l’impression 3D, connectée aux machines en temps réel.",
  },
]
