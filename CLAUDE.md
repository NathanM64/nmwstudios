# nmwstudios

Site vitrine statique. Cible : les directeurs d'agence sans équipe technique. Le site vend
de la sous-traitance en marque blanche.

Le dépôt produit deux images : le site lui-même, servi par Caddy, et `service/`, l'endpoint
qui reçoit le formulaire de contact et le poste à Resend. Le site étant un export statique,
il ne peut rien recevoir en POST : d'où un second conteneur, routé par Traefik sur
`/api/contact`. Son compose vit dans le dépôt `infra`.

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
- `node_modules` n'est PAS ancré dans `.gitignore` : `service/` a le sien, et un `/node_modules`
  ancré ne couvrait que la racine. 26 Mo sont passés à un commit près.

## Pièges connus

- Les variables `next/font` se posent sur `<html>` dans `app/layout.tsx`, jamais sur
  `<body>` : Tailwind déclare `--font-*` sur `:root`, et plus bas la `var()` serait
  irrésolue au moment de la déclaration, laissant tout le document sur la police de repli.
  Un test le vérifie.
- `output: 'export'` : pas de route dynamique, pas de middleware, pas de composant serveur
  qui lit une requête. Toute page ajoutée doit être rendue à la construction.
- La CSP posée par le `Caddyfile` interdit tout domaine tiers. Ce n'est pas une règle de
  Nathan, c'est un choix d'ingénierie : rien à charger, rien à attendre, et la promesse des
  mentions légales reste vérifiable par le navigateur. Elle se discute donc, comme le reste.
  Ce qui ne se discute pas : si le site se met à déposer un cookie ou à charger un tiers,
  c'est le paragraphe « Données personnelles » qui doit changer le même jour.
  `form-action` vaut `'self'` depuis que le bloc contact porte un vrai formulaire.
- Une mesure d'audience est prévue, dans le dépôt `infra`, hébergée sur le même serveur.
  Servie depuis ce domaine, elle ne serait ni une requête tierce ni un cookie : elle passe
  sous le test ci-dessus. C'est `aucun script hors du paquet Next` qui la voit. Quand il
  casse, le paragraphe « Données personnelles » des mentions légales doit être réécrit, la
  phrase « à ce jour » devient fausse.
- Le journal d'accès de Traefik est désactivé (`infra/compose/traefik.yml`), et le
  `Caddyfile` ne pose aucune directive `log`. C'est ce qui rend vraie la phrase « aucune
  donnée n'est collectée lors de la consultation ». L'activer la rend fausse sans toucher
  au site, et aucun test d'ici ne le verra.

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
