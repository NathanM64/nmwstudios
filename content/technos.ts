// Les quatre exemples sont là pour le référencement et pour que l’agence se reconnaisse,
// pas pour borner ce qui est possible. Le vrai critère est dans CRITERES, juste en dessous.
export type Techno = { nom: string; corps: string }

export const TECHNOS: Techno[] = [
  {
    nom: 'Symfony',
    corps:
      "Reprise de site Symfony, des versions 3 et 4 encore en production jusqu’aux versions récentes. Y compris les projets bloqués sur une version qui n’est plus maintenue, où la montée doit se faire sans couper le service.",
  },
  {
    nom: 'PHP sans framework',
    corps:
      "Du PHP écrit à la main, souvent sans tests, parfois sans historique Git, avec des fichiers modifiés directement sur le serveur. C’est reprenable, à condition de commencer par remettre l’historique et les accès au propre.",
  },
  {
    nom: 'React et JavaScript ancien',
    corps:
      "Composants de classe, Webpack figé, dépendances qui ne s’installent plus sur une machine récente. Je remets d’abord le projet en état de démarrer, avant de toucher au code.",
  },
  {
    nom: 'WordPress sur mesure',
    corps:
      "Maintenance de WordPress à thème développé sur mesure et à extensions maison, celles qui n’ont pas de mise à jour parce que personne ne les publie.",
  },
]

// Les trois questions posées avant de dire oui. Elles sont vraies quel que soit le langage,
// et ce sont elles qui décident du prix.
export const CRITERES: string[] = [
  'Le code source est accessible, en entier.',
  "Le projet peut redémarrer sur une machine neuve, même au prix de quelques jours.",
  "L’hébergement et le nom de domaine peuvent passer à votre nom.",
]
