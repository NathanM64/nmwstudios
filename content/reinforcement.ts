// The line between what gets decided alone and what comes back to the agency. This answers
// the only real question an agency without a technical team has: who arbitrates, and when.
export type Split = { title: string; body: string }

export const DECISION_SPLIT: Split[] = [
  {
    title: 'Je tranche seul',
    body:
      "La structure du code, le découpage, la bibliothèque à prendre ou à éviter, la dette qu'on paie maintenant et celle qu'on laisse. Ce sont des questions techniques, elles ont des réponses techniques. Vous faire arbitrer là-dessus reviendrait à vous faire perdre une heure pour en gagner dix minutes.",
  },
  {
    title: 'Je m’arrête et je vous demande',
    body:
      "Dès qu'un choix change ce que vos utilisateurs voient ou font. Un parcours qui se raccourcit, un champ qui devient obligatoire, une règle de gestion qui se déplace. C'est votre métier et celui de votre client, pas le mien. Je pose la question, je donne les options avec leur coût en jours, et j'attends.",
  },
]

// What the agency keeps at the end of a support engagement. Three lines, because three things
// are actually produced: the opening audit, the closing report, and the history.
export const HANDED_OVER: string[] = [
  "L'audit du début, tel que je vous l'ai envoyé le premier jour.",
  'Un compte rendu de ce qui a été fait, et de ce qui restait ouvert.',
  'Un historique Git lisible, un commit par intention, pas un « fix » toutes les trois heures.',
]
