// Ni nom, ni logo, ni lien : le secteur, la technique et un fait vérifiable suffisent à
// montrer qu'il y a de la matière derrière la discrétion. La preuve est ce que le lecteur
// cherche, bien avant la pile technique : ancienneté en production, volume tenu, ou service
// toujours rendu. Une ligne sans preuve reste une ligne sans preuve, on ne l'invente pas.
export type Travail = { corps: string; preuve?: string }

export const TRAVAUX: Travail[] = [
  {
    corps:
      "Un jeu concours écrit en PHP par quelqu’un d’autre, livré sans base de données. J’ai posé la base, puis tout le backoffice : gagnants et perdants, envois automatisés, formulaire d’adresse, validation, remise des lots en base, statistiques et exports.",
    preuve: 'Plus de 100 000 joueurs en un mois',
  },
  {
    corps:
      "Application iPad hors ligne pour les commerciaux d’un émetteur international de cartes de paiement, avec synchronisation différée dès que le réseau revient.",
    preuve: 'En production et maintenue depuis deux ans',
  },
  {
    corps:
      "Backoffice de création de campagnes de jeux pour une agence marketing, que je fais évoluer au fil des campagnes : nouveaux jeux, améliorations, corrections.",
    preuve: 'Toujours en service',
  },
  {
    corps:
      "Plateforme industrielle de pilotage de l’impression 3D, connectée aux machines en temps réel.",
  },
]
