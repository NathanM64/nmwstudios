# nmwstudios

Site vitrine statique de NMW Studios, en Next 16 avec `output: 'export'`, servi par Caddy.

Le dépôt produit deux images : le site lui-même, et `service/`, l'endpoint qui reçoit le
formulaire de contact et le poste à Resend. Le site étant un export statique, il ne peut rien
recevoir en POST : d'où un second conteneur, routé par Traefik sur `/api/contact`. Son compose
vit dans le dépôt `infra`.

## État au 7 septembre 2026

**L'interface a été entièrement retirée.** `app/`, `components/` et `DESIGN.md` sont
supprimés, et `PRODUCT.md` est remis à zéro. Le dépôt ne compile pas : c'est voulu, il attend
une direction neuve.

Aucune décision visuelle n'est en vigueur. Ne pas en déduire une depuis l'historique, depuis
le texte conservé, ni depuis les captures de `docs/`. L'étiquette `avant-reset-2026-09-07`
porte tout l'état précédent si une question se pose.

Ce qui reste est de la matière, pas des choix :

- `content/textes-du-site.md` : tout le texte réellement affiché, extrait du HTML construit.
- `content/*.ts` : les données de l'ancien site, à relire avant réemploi.
- `lib/` : mentions légales, navigation, métadonnées, schéma.
- `app/icon.svg` et `app/favicon.ico` : la marque, conservée sur demande de Nathan.

Restent récupérables depuis l'étiquette si le besoin apparaît : `app/opengraph-image.jpg` et
son texte de remplacement, et `components/ui/Logo.tsx`.

## Ce qui compte ici

Ce dépôt a déjà été rasé deux fois, la première pour sur-ingénierie. Le harnais est
volontairement mince et doit le rester.

Avant d'ajouter un filet, poser la question : est-ce qu'un changement plausible peut casser ça
en silence ? Si la réponse est non, ne pas l'écrire. Les tests de bout en bout ont été retirés
avec l'interface qu'ils décrivaient : les réécrire au fur et à mesure, jamais d'avance.

## Règles de travail

- Travail direct sur `main`, commits courts en français, poussés au fil de l'eau. Pas de
  branche, pas de pull request, pas de trailer `Co-Authored-By`.
- Portes à passer avant chaque push : `yarn lint`, `yarn typecheck`, `yarn build`,
  `yarn test:e2e`.
- Jamais de tiret cadratin dans le texte du site ni dans les commits.
- Commentaires courts, une ou deux lignes, sur le pourquoi. Pas de blocs narratifs.

## Pièges connus

Faits d'ingénierie, tombés une fois chacun. Ils ne portent aucune décision d'interface et
survivent donc à la remise à plat.

- `node_modules` n'est PAS ancré dans `.gitignore` : `service/` a le sien, et un
  `/node_modules` ancré ne couvrait que la racine. 26 Mo sont passés à un commit près.
- Les variables `next/font` se posent sur `<html>`, jamais sur `<body>` : Tailwind déclare
  `--font-*` sur `:root`, et plus bas la `var()` serait irrésolue au moment de la déclaration,
  laissant tout le document sur la police de repli. La casse est silencieuse.
- `output: 'export'` : pas de route dynamique, pas de middleware, pas de composant serveur qui
  lit une requête. Toute page ajoutée doit être rendue à la construction.
- Tailwind laisse tomber sans un mot une classe dont le jeton n'existe pas. La classe
  disparaît, la construction réussit, et rien ne le voit.
- La CSP posée par le `Caddyfile` interdit tout domaine tiers. Elle se discute. Ce qui ne se
  discute pas : si le site se met à déposer un cookie ou à charger un tiers, c'est le
  paragraphe « Données personnelles » des mentions légales qui doit changer le même jour.
- Le journal d'accès de Traefik est désactivé (`infra/compose/traefik.yml`), et le `Caddyfile`
  ne pose aucune directive `log`. C'est ce qui rend vraie la phrase « aucune donnée n'est
  collectée lors de la consultation ». L'activer la rend fausse sans toucher au site, et aucun
  test d'ici ne le verra.
