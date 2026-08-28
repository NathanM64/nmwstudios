// La ligne de partage entre ce qui se tranche tout seul et ce qui remonte. C'est la réponse
// à la seule vraie question d'une agence sans équipe technique : qui arbitre, et quand.
export type Partage = { titre: string; corps: string }

export const PARTAGE: Partage[] = [
  {
    titre: 'Je tranche seul',
    corps:
      "La structure du code, le découpage, la bibliothèque à prendre ou à éviter, la dette qu'on paie maintenant et celle qu'on laisse. Ce sont des questions techniques, elles ont des réponses techniques. Vous faire arbitrer là-dessus reviendrait à vous faire perdre une heure pour en gagner dix minutes.",
  },
  {
    titre: 'Je m’arrête et je vous demande',
    corps:
      "Dès qu'un choix change ce que vos utilisateurs voient ou font. Un parcours qui se raccourcit, un champ qui devient obligatoire, une règle de gestion qui se déplace. C'est votre métier et celui de votre client, pas le mien. Je pose la question, je donne les options avec leur coût en jours, et j'attends.",
  },
]

// Ce qui reste à l'agence à la fin d'un renfort. Trois lignes, parce que trois choses sont
// réellement produites : le regard du début, le compte rendu de la fin, et l'historique.
export const LIVRE: string[] = [
  "L'audit du début, tel que je vous l'ai envoyé le premier jour.",
  'Un compte rendu de ce qui a été fait, et de ce qui restait ouvert.',
  'Un historique Git lisible, un commit par intention, pas un « fix » toutes les trois heures.',
]
