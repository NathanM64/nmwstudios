# nmwstudios

Site vitrine statique. Cible : les directeurs d'agence sans équipe technique. Le site vend
de la sous-traitance en marque blanche.

## Ce qui compte ici

Ce dépôt a déjà été rasé une fois pour sur-ingénierie. Le harnais est volontairement mince
et doit le rester : lint, typecheck, build, et quatre tests de bout en bout qui protègent
les promesses affichées par le site. Pas de test unitaire sur un composant de présentation.

Avant d'ajouter un filet, poser la question : est-ce qu'un changement plausible peut casser
ça en silence ? Si la réponse est non, ne pas l'écrire.

## Règles de travail

- Travail direct sur `main`, commits courts en français, poussés au fil de l'eau. Pas de
  branche, pas de pull request, pas de trailer `Co-Authored-By`.
- Portes à passer avant chaque push : `yarn lint`, `yarn typecheck`, `yarn build`,
  `yarn test:e2e`.
- Jamais de tiret cadratin dans le texte du site ni dans les commits.
- Commentaires courts, une ou deux lignes, sur le pourquoi. Pas de blocs narratifs.

## Pièges connus

- Les variables `next/font` se posent sur `<html>` dans `app/layout.tsx`, jamais sur
  `<body>` : Tailwind déclare `--font-*` sur `:root`, et plus bas la `var()` serait
  irrésolue au moment de la déclaration, laissant tout le document sur la police de repli.
  Un test le vérifie.
- `output: 'export'` : pas de route dynamique, pas de middleware, pas de composant serveur
  qui lit une requête. Toute page ajoutée doit être rendue à la construction.
- La CSP posée par le `Caddyfile` interdit tout domaine tiers. Ajouter une police
  distante, un script d'analyse ou une carte casserait à la fois la règle et l'argument
  central du site.

## Direction visuelle

« Le pli » : un mur de lumière grise et grenue, fixe sous toute la page, et des dalles de
verre presque incolores qui le compriment sur leur tranche. Un seul mode, pas de thème
sombre, aucune couleur. Schibsted Grotesk pour les titres, Hanken Grotesk pour le corps,
aucune monospace. Le détail est dans `DESIGN.md`, qui fait autorité.

Le geste de signature est la réfraction : `components/ui/Refraction.tsx` mesure chaque
élément `data-verre`, calcule sa carte de déplacement à sa taille et la pose en
`backdrop-filter`. Le mur ne défile pas, le verre passe dessus, et le pli vit sans script
d'animation. Ne pas ajouter de deuxième matériau.

Les classes du système vont dans `@layer base` ou `@layer components`. Hors couche, elles
battent les utilitaires Tailwind : `.verre { position: relative }` a déjà annulé en silence
un `absolute` posé sur une dalle.

Aucune animation ne passe par un écouteur de défilement : `animation-timeline: view()` et
`IntersectionObserver` couvrent tout. Tout mouvement est gardé derrière
`prefers-reduced-motion`.
