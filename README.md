# nmwstudios

Site vitrine de NMW Studios. Il s'adresse aux agences sans équipe technique et vend de la
sous-traitance en marque blanche : renfort à la journée, projet complet, reprise et
maintenance d'un existant.

Deux pages portent le message, l'accueil et « Reprise et maintenance ». Les mentions
légales et la page 404 complètent le tout. Il n'y a pas de blog, pas de formulaire et
aucun service tiers.

## Stack

Next 16 en export statique, React 19, Tailwind 4, TypeScript. `yarn build` produit du HTML
dans `out/` : la production ne fait tourner ni Node ni base de données, seulement Caddy.

## Commandes

```bash
yarn dev          # développement, http://localhost:3000
yarn build        # export statique dans out/
yarn serve        # sert out/ sur le port 3000, pour vérifier le site réel
yarn lint
yarn typecheck
yarn test:e2e     # construit d'abord avec yarn build
```

## Ce que les filets protègent

Quatre tests de bout en bout, et pas un de plus. Ils tiennent les promesses que le site
affiche et que du code ajouté casse sans bruit : aucune requête vers un domaine tiers,
aucun cookie, les polices réellement appliquées, et les ancres entre les deux pages.

## Mise en ligne

```bash
docker build -t nmwstudios .
docker run --rm -p 8080:80 nmwstudios
```

L'image ne contient pas Node : le HTML est produit à la construction et servi par Caddy.
Le certificat et le domaine sont posés par le proxy décrit dans le dépôt `infra`.

## Contenu

Le texte qui se répète vit dans `content/`, séparé des composants : `offres.ts` pour les
trois manières de travailler, `engagements.ts` pour les promesses de marque blanche,
`technos.ts` pour ce qui est repris, `semaines.ts` pour le déroulé d'une reprise. La prose
longue reste dans les pages, là où elle se relit.

Les informations légales et le tarif journalier sont dans `lib/legal.ts`.
