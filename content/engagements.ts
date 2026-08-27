// Le geste du site : chaque engagement porte sa contrepartie. Un directeur d’agence lit
// d’abord ce qu’un prestataire ne fera pas, parce que c’est là que sont les surprises.
export type Engagement = { fait: string; pasFait: string }

export const ENGAGEMENTS: Engagement[] = [
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
