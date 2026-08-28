// The four examples are here for search and so the agency recognises itself, not to bound what
// is possible. The real criterion sits in CRITERIA, just below.
export type Stack = { name: string; body: string }

export const STACKS: Stack[] = [
  {
    name: 'Symfony',
    body:
      "Reprise de site Symfony, des versions 3 et 4 encore en production jusqu’aux versions récentes. Y compris les projets bloqués sur une version qui n’est plus maintenue, où la montée doit se faire sans couper le service.",
  },
  {
    name: 'PHP sans framework',
    body:
      "Du PHP écrit à la main, souvent sans tests, parfois sans historique Git, avec des fichiers modifiés directement sur le serveur. C’est reprenable, à condition de commencer par remettre l’historique et les accès au propre.",
  },
  {
    name: 'React et JavaScript ancien',
    body:
      "Composants de classe, Webpack figé, dépendances qui ne s’installent plus sur une machine récente. Je remets d’abord le projet en état de démarrer, avant de toucher au code.",
  },
  {
    name: 'WordPress sur mesure',
    body:
      "Maintenance de WordPress à thème développé sur mesure et à extensions maison, celles qui n’ont pas de mise à jour parce que personne ne les publie.",
  },
]

// The three questions asked before saying yes. They hold whatever the language is, and they
// are what decides the price.
export const CRITERIA: string[] = [
  'Le code source est accessible, en entier.',
  "Le projet peut redémarrer sur une machine neuve, même au prix de quelques jours.",
  "L’hébergement et le nom de domaine peuvent passer à votre nom.",
]
