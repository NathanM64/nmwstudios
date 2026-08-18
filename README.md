# NMW Studios — site vitrine

Site vitrine de NMW Studios, studio web indépendant à Bordeaux. Refonte en
cours autour d'un langage « Verre » à deux portes (entreprise / agence), un
dock de navigation et deux thèmes.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- Vitest (tests unitaires) et Playwright + axe-core (tests e2e et accessibilité)
- Déploiement : Vercel
- Gestionnaire de paquets : **yarn uniquement** — aucun `package-lock.json` ne doit exister

## Commandes

```bash
yarn install      # dépendances

yarn dev          # serveur de développement, http://localhost:3000
yarn build        # build de production
yarn start        # sert le build de production

yarn lint         # ESLint
yarn test         # tests unitaires (Vitest)
yarn test:e2e     # tests bout en bout (Playwright), servis sur le port 3100
yarn budget       # mesure le JavaScript de première charge sur /agences
```

`yarn test:e2e` construit et démarre son propre serveur sur le port 3100,
pas 3000 : ce dernier est souvent occupé par un autre projet, et réutiliser
un serveur étranger ferait tourner la suite sur la mauvaise application.

## État actuel

En place :

- deux portes réelles, `/` (entreprise) et `/agences` (agence), avec
  commutateur d'audience et mémorisation du choix en cookie ;
- un dock de navigation, lisible sur mobile ;
- deux thèmes (sombre par défaut, clair complet), posés avant le premier paint
  par un script inline dans `<head>` — aucun flash, mais le mécanisme dépend de
  JavaScript actif ; sans JS, le thème retombe sur le sombre par défaut ;
- transitions inter-documents natives entre les deux portes.

Reste à faire, connu :

- **pages légales absentes** : `/mentions-legales` et `/confidentialite`
  n'existent pas. Elles exigent des données que seul le propriétaire du
  projet détient (SIRET, forme juridique, adresse, directeur de publication,
  TVA) ;
- **contenu commercial absent** : ce lot ne pose que la coquille, sans texte
  commercial. Il fait l'objet du lot 1 ;
- **logo non intégré** : `public/logo.webp` (96×96) a été produit en repli du
  PNG d'origine, mais aucun composant ne l'affiche — il n'y a pas encore
  d'en-tête. Le SVG reste dû par le propriétaire du projet.

## Contraintes du projet

- yarn uniquement.
- Aucune librairie d'animation : CSS natif (`animation-timeline`,
  `@view-transition`).
- Le rayon de `blur()` ne s'anime jamais ; les animations continues ne
  portent que sur `opacity` et `transform` (une transition discrète de
  couleur au survol y échappe).
- Contraste ≥ 4,5:1 dans les deux thèmes, vérifié par test.
- Aucun texte long sur une surface de verre.
- Aucun chiffre affiché qui ne soit mesuré. Aucun client, avis ou référence
  inventé.
- Pas de plafond de JavaScript imposé : `yarn budget` mesure et rapporte le
  poids de la première charge, sans jamais faire échouer la commande.
  Référence actuelle : 131,3 ko gzip sur `/agences`, plancher constaté de
  Next 16 avec React 19 sur une page vide, polyfills exclus.
- Messages de commit en français, sans `Co-Authored-By`.

## Pointeurs

- Spec design : `docs/superpowers/specs/2026-08-17-refonte-vitrine-design.md`
- Plan du lot 0 : `docs/superpowers/plans/2026-08-17-refonte-vitrine-lot0.md`

Ces deux fichiers ne sont pas suivis par git (`.gitignore` exclut les `.md`
autres que `README.md` et `CLAUDE.md`) : ils n'existent que localement.
