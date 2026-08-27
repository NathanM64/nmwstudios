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

« Carbone » : le papier d'un duplicata de contrat, l'encre bleu-violet qui imprime dessous
sans être vue. Un seul mode, pas de thème sombre. Archivo pour les titres, Source Serif 4
pour le corps, IBM Plex Mono pour les étiquettes et les chiffres.

Le geste de signature est le décalque (`.calque`) : chaque promesse porte sa contrepartie,
imprimée en carbone et calée deux pixels plus bas. C'est le seul effet du site. Ne pas en
ajouter d'autre.
