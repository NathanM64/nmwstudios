// The gesture of the site: every commitment carries its counterpart. An agency director reads
// first what a contractor will not do, because that is where the surprises live.
export type Commitment = { fait: string; pasFait: string }

export const COMMITMENTS: Commitment[] = [
  {
    fait: 'Je travaille sous votre nom, dans vos outils, avec votre méthode.',
    pasFait: "Je n’apparais dans aucun échange avec votre client.",
  },
  {
    fait: "Je signe votre accord de confidentialité avant d’ouvrir le projet.",
    pasFait: 'Je ne cite aucun nom de client, ni sur ce site, ni en rendez-vous.',
  },
  {
    fait: "C’est écrit dans mes conditions de vente, pas seulement dit au téléphone.",
    pasFait: 'Je ne démarche pas vos comptes, ni pendant la mission, ni après.',
  },
]
