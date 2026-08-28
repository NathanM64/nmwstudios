// No name, no logo, no link: the sector, the technique and one verifiable fact are enough to
// show there is substance behind the discretion. Proof is what the reader looks for, long
// before the stack: years in production, volume held, or a service still running. A line
// without proof stays a line without proof, and we do not invent one.
export type WorkItem = { body: string; proof?: string }

export const WORK: WorkItem[] = [
  {
    body:
      "Un jeu concours écrit en PHP par quelqu’un d’autre, livré sans base de données. J’ai posé la base, puis tout le backoffice : gagnants et perdants, envois automatisés, formulaire d’adresse, validation, remise des lots en base, statistiques et exports.",
    proof: 'Plus de 100 000 joueurs en un mois',
  },
  {
    body:
      "Application iPad hors ligne pour les commerciaux d’un émetteur international de cartes de paiement, avec synchronisation différée dès que le réseau revient.",
    proof: 'En production et maintenue depuis deux ans',
  },
  {
    body:
      "Backoffice de création de campagnes de jeux pour une agence marketing, que je fais évoluer au fil des campagnes : nouveaux jeux, améliorations, corrections.",
    proof: 'Toujours en service',
  },
  {
    body:
      "Plateforme industrielle de pilotage de l’impression 3D, connectée aux machines en temps réel.",
  },
]
