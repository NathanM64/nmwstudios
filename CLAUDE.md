# NMW Studios — site vitrine

Refonte en cours. Spec : `docs/superpowers/specs/2026-08-17-refonte-vitrine-design.md`

## Commentaires

Une ligne, deux au maximum. Le fait, pas l'histoire.

On commente ce qui n'est pas déductible du code : un piège, une contrainte
externe, une raison de ne pas « simplifier ». Jamais de bloc narratif, jamais
de paraphrase du code, jamais l'historique d'un bug. Un commentaire qui décrit
ce que fait la ligne suivante se supprime.

## Contraintes du projet

- yarn uniquement — aucun `package-lock.json`.
- Aucune librairie d'animation : CSS natif (`animation-timeline`, `@view-transition`).
- Poids du JavaScript de première charge : mesuré et rapporté par `yarn budget`, sans plafond bloquant. Référence au lot 0 : ≈ 131 ko gzip. On fait au mieux ; toute hausse notable se justifie.
- Contraste ≥ 4,5:1 dans les deux thèmes, vérifié par test.
- Le rayon de `blur()` ne s'anime jamais ; les animations continues ne portent que sur `opacity` et `transform` (une transition discrète de couleur au survol y échappe).
- Aucun texte long sur une surface de verre.
- Aucun chiffre affiché qui ne soit mesuré. Aucun client, avis ou référence inventé.
- Messages de commit en français, sans `Co-Authored-By`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
